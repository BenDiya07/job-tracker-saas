import type { Response } from 'express';
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import { prisma } from '../config/db.js';
import { z } from 'zod';

const jobSchema = z.object({
  company: z.string().min(1, "La structure/entreprise est requise"),
  position: z.string().min(1, "Le poste est requis"),
  location: z.string().optional(),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']).default('applied'),
  jobUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional()
});

const getFallbackUserId = async () => {
  const guestEmail = process.env.GUEST_USER_EMAIL || 'guest@example.com';
  const guestUser = await prisma.user.upsert({
    where: { email: guestEmail },
    update: {},
    create: {
      email: guestEmail,
      name: 'Invité',
      password: process.env.GUEST_USER_PASSWORD || 'guest'
    }
  });
  return guestUser.id;
};

// Créer un Job
export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = jobSchema.parse(req.body);
    const userId = req.userId || await getFallbackUserId();
    // On convertit les champs optionnels undefined en null pour Prisma
    const jobData = {
      ...validatedData,
      userId,
      location: validatedData.location ?? null,
      jobUrl: validatedData.jobUrl ?? null,
      notes: validatedData.notes ?? null,
    };
    const job = await prisma.job.create({
      data: jobData
    });
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

// Lire tous les Jobs de l'utilisateur connecté
export const getJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId || await getFallbackUserId();
    const jobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' } // Du plus récent au plus ancien
    });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les stats pour le Dashboard
// Pourquoi faire l'agrégation côté BDD ? C'est beaucoup plus performant que de récupérer 1000 lignes et de les filtrer en JavaScript.
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId || await getFallbackUserId();

    // On utilise groupBy de Prisma pour compter le nombre de jobs par statut d'un coup
    const stats = await prisma.job.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    });

    // Formater la réponse pour qu'elle soit super simple à lire pour le Front
    const formattedStats = {
      totalJobs: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    };

    stats.forEach((item: { status: string; _count: { status: number; }; }) => {
      const status = item.status as keyof Omit<typeof formattedStats, 'totalJobs'>;
      formattedStats[status] = item._count.status;
      formattedStats.totalJobs += item._count.status;
    });

    res.json(formattedStats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
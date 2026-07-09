import { Router } from 'express';
import { prisma } from '../config/db.js'; // Notre instance Prisma connectée à Neon

const router = Router();

// Route pour récupérer tous les jobs de la base de données
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany(); // 'job' correspond au modèle introspecté depuis Neon
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Impossible de récupérer les jobs" });
  }
});

export default router;
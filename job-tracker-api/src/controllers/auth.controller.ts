import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import { prisma } from '../config/db.js';
import { z } from "zod";

// Pourquoi Zod ? Pour valider les données côté serveur AVANT d'interroger la base de données. 
// Cela évite les erreurs SQL et sécurise l'API contre les injections ou données corrompues.

const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères")
});

export const register = async (req: Request, res: Response) => {
    try {
        // 1. Validation des données d'entrée
        const validateData = registerSchema.parse(req.body);

        // 2. Vérification si l'utilisateur existe déjà
        const userExists = await prisma.user.findUnique({ where: { email: validateData.email } });
        if (userExists) return res.status(400).json({ message: "Cet email est déjà utilisé." });

        // 3. Sécurisation du mot de passe (Hachage avec bcrypt - 10 tours de "salt")
        // Pourquoi ? On ne stocke JAMAIS un mot de passe en clair pour des raisons de sécurité évidentes.
        const hashedPassword = await bcrypt.hash(validateData.password, 10);

        // 4. Création de l'utilisateur dans la base de données
        const user = await prisma.user.create({
            data: { name: validateData.name, email: validateData.email, password: hashedPassword }
        });
        // 5. Réponse au client avec succès
        res.status(201).json({ message: "Utilisateur créé avec succès.", userId: user.id });

    } catch (error: any) {
        // Gestion des erreurs de validation Zod
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Données invalides.", errors: error.issues || error.message });
        }
        // Gestion des autres erreurs (ex: base de données, serveur)
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis")
});

export const login = async (req: Request, res: Response) => {
    try {
        // 1. Validation des données d'entrée
        const validateData = loginSchema.parse(req.body);

        // 2. Vérification si l'utilisateur existe par son email
        const user = await prisma.user.findUnique({ where: { email: validateData.email } });
        if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect." });

        // 3. Comparaison du mot de passe fourni avec le mot de passe haché en BDD
        // Pourquoi ? Sans cette vérification, n'importe qui pourrait se connecter en connaissant seulement l'email.
        const passwordValid = await bcrypt.compare(validateData.password, user.password);
        if (!passwordValid) return res.status(400).json({ message: "Email ou mot de passe incorrect." });

        // 4. Génération du token. IMPORTANT: le payload doit correspondre à ce que lit le middleware d'auth ({ userId }).
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.json({ token, id: user.id, name: user.name, email: user.email });
    } catch (error) {
        // Gestion des erreurs de validation Zod
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Données invalides.", errors: error.issues || error.message });
        }
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Grace au middleware d'authentification, on a accès à req.userId de maniere securisée
        if (!req.userId) {
            return res.status(401).json({ message: "Non autorisé." });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true } // On exclut volontairement le password de la réponse !
        });

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
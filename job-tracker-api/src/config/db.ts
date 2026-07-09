import { PrismaClient } from '@prisma/client';
// On instancie le client Prisma qui va nous permettre de faire des requêtes SQL en JS/TS.
// Pourquoi cette instance unique ? Pour éviter d'ouvrir plusieurs connexions inutiles 
export const prisma = new PrismaClient();
import express from 'express';
import cors from 'cors';
import { register, login, getProfile } from './controllers/auth.controller.js';
import { createJob, getJobs, getDashboardStats } from './controllers/job.controller.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express();

// Pourquoi CORS ? Par sécurité, un navigateur bloque les requêtes HTTP entre deux domaines différents (ex: localhost:3000 vers localhost:5000).
// Activer cors() autorise nos applications clientes à communiquer avec l'API.
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json()); // Pour parser le body des requêtes en JSON

// Routes Authentification
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Routes Candidatures
app.get('/api/jobs', getJobs);
app.post('/api/jobs', createJob);
app.get('/api/jobs/stats', getDashboardStats);

// Route protégée par le middleware d'authentification
app.get('/api/auth/profile', authMiddleware, getProfile);

export default app;
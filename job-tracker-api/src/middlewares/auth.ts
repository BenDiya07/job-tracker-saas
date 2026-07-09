import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// On étend l'interface Request d'Express pour pouvoir y injecter l'ID de l'utilisateur connecté
// Pourquoi ? Pour que toutes les routes qui suivent ce middleware sachent quel utilisateur fait la requête.

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Récupération du header d'autorisation. Le format standard est: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Si aucun token n'est fourni, on bloque direct avec un code 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        // 2. Vérification du token avec la clé secrète Si le token est invalide une exception sera levée.

        const decode = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

        // 3. On injecte l'ID utilisateur décodé dans l'objet request
        req.userId = decode.userId;

        // 4. On passe au contrôleur suivant (la route est autorisée)
        next();
    } catch (error) {
        // Si le token a expiré ou a été modifié, on renvoie une erreur 403 (Forbidden)
        res.status(403).json({ message: 'Token invalide ou expiré.' });
    }

};

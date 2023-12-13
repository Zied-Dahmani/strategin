import { Request, Response, NextFunction } from 'express';
import { getUserByEmail } from '../models/user';
var jwt = require('jsonwebtoken');

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['auth-token'];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized", result: null });
        }

        const decodedToken = jwt.verify(token, 'AUTH');

        const user = await getUserByEmail(decodedToken.email);

        if (!user) {
            return res.status(401).json({ message: "User not found", result: null });
        }

        req.session.user = user;

        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired", result: error });
        }
        console.error("Error verifying authentication:", error);
        return res.status(500).json({ message: "Failed to verify authentication", result: error });
    }
}
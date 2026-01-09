import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Payload } from '../types/user';

dotenv.config();

export interface ExtendedRequest extends Request {
    info?: Payload;
}

export function verifyToken(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers['token'] as string;
        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as Payload;
        req.info = decodedData;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

export function requireAdmin(req: ExtendedRequest, res: Response, next: NextFunction) {
    if (!req.info) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.info.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
}

export function requireFarmer(req: ExtendedRequest, res: Response, next: NextFunction) {
    if (!req.info) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.info.role !== 'farmer') {
        return res.status(403).json({ message: 'Farmer access required' });
    }

    next();
}

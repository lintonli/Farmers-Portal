import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    getUsers, 
    updateCertificationStatus,
    getFarmerStatus 
} from '../controllers/userController';
import { verifyToken, requireAdmin, requireFarmer } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - Admin only
router.get('/farmers', verifyToken, requireAdmin, getUsers);
router.patch('/farmers/:userId/status', verifyToken, requireAdmin, updateCertificationStatus);

// Protected routes - Farmer only
router.get('/my-status', verifyToken, requireFarmer, getFarmerStatus);

export default router;

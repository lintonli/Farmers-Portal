import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    getUsers, 
    updateCertificationStatus,
    getFarmerStatusById
} from '../controllers/userController';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/farmers', verifyToken, requireAdmin, getUsers);
router.patch('/farmers/:userId/status', verifyToken, requireAdmin, updateCertificationStatus);

router.get('/farmers/:id/status', verifyToken, getFarmerStatusById);

export default router;

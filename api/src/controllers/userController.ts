import {Response, Request, RequestHandler} from 'express'
import {v4 as  uid} from 'uuid'
import { registerSchema } from '../utils/registerValidator';
import { generateToken, hashPassword, verifyPassword } from '../utils/authUtils';
import { prisma } from '../prisma/db';
import { loginSchema } from '../utils/loginValidator';
import logger from '../utils/logger';




export const registerUser = async(req:Request, res:Response)=>{
    try{
        const id = uid();
        const {firstName, lastName, email,password,phoneNumber, farmSize, cropType}= req.body;
        const {error} = registerSchema.validate(req.body);
        if(error){
            return res.status(400).json(error.details[0].message);
        }

        const hashedPassword = await hashPassword(password);
        const existingUser = await prisma.user.findUnique({where:{email}});
        if(existingUser){
            return res.status(409).json({message:"Email already Exists"})
        }

        const newUser = await prisma.user.create({
            data:{
                id:id,
                firstName:firstName,
                lastName: lastName,
                email:email,
                password:hashedPassword,
                phoneNumber:phoneNumber,
                farmer: {
                    create: {
                        farmSize: farmSize,
                        cropType: cropType
                    }
                }
            },
            include: {
                farmer: true
            }
        })
        return res.status(200).json({message:"User added successfully", newUser})


    }catch(error: any){
        logger.error('Registration error:');
        return res.status(500).json({
            message: "Registration failed",
            error
        });
    }
}

export const loginUser = async(req:Request, res:Response)=>{
    try {
        const {email, password} = req.body;

        const{error}= loginSchema.validate(req.body);
        if(error){
            return res.status(400).json(error.details[0].message);
        }
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            logger.warn(`Failed login attempt - User not found: ${email}`);
            return res.status(422).json({message:`Incorrect email or password. Please try again`})
        }
        const isValid = await verifyPassword(password, user.password)
         if (!isValid) {
            logger.warn(`Failed login attempt - Incorrect password: ${email}`);
            return res.status(422).json({message:"Incorrect email or password. Please try again"});
         }

         const token = generateToken(user);
         logger.info(`Successful login - User: ${email}`);
         return res.status(200).json({ message: "Login successfull", token });


    } catch (error) {
        console.log("fhdbfjdf",error)
        return res.status(500).json({message:"Login failed", error});
    }
}

export const getUsers:RequestHandler= async(req, res)=>{
    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'farmer'
            },
            include: {
                farmer: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        if(users.length === 0){
            return res.status(404).json({message:"No Farmers found"})
        }
        return res.status(200).json({message:'Farmers successfully retrieved', users})
    } catch (error) {
        return res.status(500).json(error);
    }
}


export const updateCertificationStatus=async(req:Request, res:Response) => {
    try {
        const { userId } = req.params;
        const { status } = req.body; 

        if (!['certified', 'declined', 'pending'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'certified', 'declined', or 'pending'" });
        }

        const farmer = await prisma.farmer.findUnique({
            where: { userId },
            include: { user: true }
        });

        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        const updatedFarmer = await prisma.farmer.update({
            where: { userId },
            data: { certificationStatus: status },
            include: { user: true }
        });

        logger.info(`Certification status updated - User: ${farmer.user.email}, Status: ${status}`);
        return res.status(200).json({ 
            message: "Certification status updated successfully", 
            farmer: updatedFarmer 
        });

    } catch (error) {
        logger.error('Error updating certification status:',);
        return res.status(500).json(error);
    }
}



export const getFarmerStatusById = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Farmer ID is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
            include: { farmer: true }
        });

        if (!user) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        if (!user.farmer) {
            return res.status(404).json({ message: "Farmer profile not found" });
        }

        return res.status(200).json({
            message: "Status retrieved successfully",
            farmer: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                farmSize: user.farmer.farmSize,
                cropType: user.farmer.cropType,
                certificationStatus: user.farmer.certificationStatus,
                appliedAt: user.farmer.appliedAt
            }
        });

    } catch (error) {
        logger.error('Error getting farmer status by ID:');
        return res.status(500).json(error);
    }
}

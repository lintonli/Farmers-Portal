import {PrismaClient} from '@prisma/client'
import { hashPassword } from '../../utils/authUtils';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })
async function seed(){
    try{
        const email = "admin@example.com";

        const existingAdmin = await prisma.user.findFirst({
            where: { email },
        });

        if (existingAdmin) {
            await prisma.user.update({
                where: { email },
                data: {
                    firstName: "Demo",
                    lastName: "User",
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    firstName: "Demo",
                    lastName: "User",
                    email,
                    phoneNumber: '',
                    password: await hashPassword(email),
                    role: 'admin',
                    
                },
            });
        }
    }
     catch (error) {
        console.error("Error seeding users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed()
   .catch((error) => console.error("Seeding failed:", error))
    .finally(() => prisma.$disconnect());
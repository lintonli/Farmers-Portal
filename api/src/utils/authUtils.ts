import bcrypt from "bcrypt";
import { Payload } from "../types/user";
import Jwt from 'jsonwebtoken'


export async function hashPassword(password:string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password:string, hashedPassword:string) {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken=(user:any)=>{
    const payload: Payload= {
        sub:user.id,
        email:user.email,
        role:user.role
    };
    const token = Jwt.sign(payload, process.env.JWT_SECRET as string,{expiresIn: "1h"});
    return token;

}
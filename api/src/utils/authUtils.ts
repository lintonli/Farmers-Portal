import bcrypt from "bcrypt";

export async function hashPassword(plainPassword:string) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}
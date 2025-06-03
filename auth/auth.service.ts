// Database
import { sql } from "drizzle-orm";
import db from "../drizzle/db";
// Update the import path below if your schema file is located elsewhere, e.g. "../drizzle/schemas" or "../schema"
import { TIUser, UsersTable } from "../drizzle/schema";
// If the file does not exist, create 'schema.ts' in the 'drizzle' folder and export TIUser and UsersTable from it.

export const createUserService = async (user: TIUser) => {
    await db.insert(UsersTable).values(user)
    return "User created successfully";
}

export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`
    });
};

export const verifyUserService = async (email: string) => {
    await db.update(UsersTable)
        .set({ isVerified: true, verificationCode: null })
        .where(sql`${UsersTable.email} = ${email}`);
}


//login a user
export const userLoginService = async (user: TIUser) => {
    // email and password
    const { email } = user;

    return await db.query.UsersTable.findFirst({
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true
        }, where: sql`${UsersTable.email} = ${email} `
    })
}
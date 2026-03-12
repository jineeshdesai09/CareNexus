import { PrismaClient } from '../app/generated/prisma/client.ts';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const medicines = [
        { Name: 'Paracetamol', GenericName: 'Acetaminophen', Category: 'Tablet' },
        { Name: 'Amoxicillin', GenericName: 'Amoxicillin', Category: 'Capsule' },
        { Name: 'Cetirizine', GenericName: 'Cetirizine', Category: 'Tablet' },
        { Name: 'Ibuprofen', GenericName: 'Ibuprofen', Category: 'Tablet' },
        { Name: 'Azithromycin', GenericName: 'Azithromycin', Category: 'Tablet' },
        { Name: 'Pantoprazole', GenericName: 'Pantoprazole', Category: 'Tablet' },
        { Name: 'Metformin', GenericName: 'Metformin', Category: 'Tablet' },
        { Name: 'Amlodipine', GenericName: 'Amlodipine', Category: 'Tablet' },
        { Name: 'Omeprazole', GenericName: 'Omeprazole', Category: 'Capsule' },
        { Name: 'Salbutamol', GenericName: 'Salbutamol', Category: 'Inhaler' },
    ];

    console.log('Seeding medicines...');
    for (const m of medicines) {
        await prisma.medicine.create({ data: m });
    }
    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

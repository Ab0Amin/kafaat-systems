import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';
import bcrypt from 'bcrypt';

async function addUser(email, plainPassword, firstName, lastName) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();

  const query = `
    INSERT INTO owner.users (
      "email", "passwordHash", "firstName", "lastName", "isActive", "role", "schemaName"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING "id";
  `;

  const values = [email, hashedPassword, firstName, lastName, true, 'owner', 'owner'];

  const result = await client.query(query, values);

  console.log('✅ User inserted with ID:', result.rows[0].id);

  await client.end();
}

// Example usage:
addUser('owner@kbs.com', 'StrongPass123', 'Ahmed', 'Abdalla');

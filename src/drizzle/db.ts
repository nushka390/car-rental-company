// src/Drizzle/db.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Adjust this if your schema is elsewhere

// Use test DB if in test mode, otherwise use the default
const isTest = process.env.NODE_ENV === 'test';

const client = postgres(
  isTest
    ? process.env.TEST_DATABASE_URL || 'postgres://postgres:Nushkez18.@localhost:5432/car_rental-db'
    : process.env.DATABASE_URL || 'postgres://postgres:Nushkez18.@localhost:5432/car_rental-db',
  {
    max: 1, // Required for drizzle + postgres-js testing
  }
);

// Connect drizzle to the database client and schema
const db = drizzle(client, { schema });

export default db;

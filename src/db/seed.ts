import "dotenv/config";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { users } from "./schema";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.SEED_EMAIL;
  const password = process.env.SEED_PASSWORD;

  if (!connectionString) throw new Error("DATABASE_URL is not set");
  if (!email || !password) {
    throw new Error("SEED_EMAIL and SEED_PASSWORD must be set");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  const existing = await db.select().from(users).limit(1);
  if (existing.length > 0) {
    console.log(`A user already exists (${existing[0].email}) — skipping seed.`);
    await client.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ email: email.toLowerCase(), passwordHash });

  await client.end();
  console.log(`Created user: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

const hasCloudflareD1 =
    !!process.env.CLOUDFLARE_ACCOUNT_ID &&
    !!process.env.CLOUDFLARE_DATABASE_ID &&
    !!process.env.CLOUDFLARE_D1_TOKEN;

export default defineConfig(
    hasCloudflareD1
        ? {
              schema: './src/core/database/schema.ts',
              out: './drizzle',
              dialect: 'sqlite',
              driver: 'd1-http',
              dbCredentials: {
                  accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
                  databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
                  token: process.env.CLOUDFLARE_D1_TOKEN!,
              },
          }
        : {
              schema: './src/core/database/schema.ts',
              out: './drizzle',
              dialect: 'sqlite',
              dbCredentials: {
                  url: process.env.SQLITE_URL || 'file:./data/coinguon-db.db',
              },
          }
);

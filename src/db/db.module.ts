import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '../config/env';
import * as schema from './schema';

export const DB_PROVIDER = 'DB_PROVIDER';
export type DbClient = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: (): DbClient => {
        const pool = new Pool({
          connectionString: env.DATABASE_URL,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class DbModule {}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      user: 'test_user',
      password: '1111',
      host: 'localhost',
      port: 5432,
      database: 'test_db',
    });

    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch (err) {
      console.error('Database connection error', err.stack);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
      console.log('Disconnected from the database');
    }
  }

  async query(text: string, params?: any[]) {
    try {
      const res = await this.client.query(text, params);
      return res.rows;
    } catch (err) {
      console.error('Query error', err.stack);
      throw err;
    }
  }
}

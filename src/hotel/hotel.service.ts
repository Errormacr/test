import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class RoomService {
  constructor(private readonly database: DatabaseService) {}

  async getAvailableRooms(queryDto: QueryDto) {
    try {
      const { startDate, endDate } = queryDto;

      const query = `
        SELECT r.room_id, r.room_name
        FROM rooms r
        WHERE NOT EXISTS (
          SELECT 1
          FROM orders o
          WHERE o.room_id = r.room_id
          AND (
            (o.start_date <= $1 AND o.end_date >= $1) OR
            (o.start_date <= $2 AND o.end_date >= $2) OR
            (o.start_date >= $1 AND o.end_date <= $2)
          )
        )
      `;
      const params = [startDate, endDate];
      const availableRooms = await this.database.query(query, params);
      return availableRooms;
    } catch (error) {
      console.error('Error fetching available rooms', error);
      throw error;
    }
  }

  async getRoom(queryDto: QueryDto, roomNumber: number) {
    try {
      const { startDate, endDate } = queryDto;

      let params: any[] = [roomNumber];
      let whereClause = 'r.room_id = $1';

      if (startDate && endDate) {
        params = [roomNumber, startDate, endDate];
        whereClause += `
          AND NOT EXISTS (
            SELECT 1
            FROM orders o
            WHERE o.room_id = r.room_id
            AND (
              (o.start_date <= $2 AND o.end_date >= $2) OR
              (o.start_date <= $3 AND o.end_date >= $3) OR
              (o.start_date >= $2 AND o.end_date <= $3)
            )
          )
        `;
      }

      const query = `
        SELECT r.room_id, r.room_name
        FROM rooms r
        WHERE ${whereClause}
      `;

      const availableRooms = await this.database.query(query, params);
      return availableRooms;
    } catch (error) {
      console.error('Error fetching room information', error);
      throw error;
    }
  }
}

import { Module } from '@nestjs/common';
import { RoomService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoomService],
  controllers: [HotelController],
})
export class HotelModule {}

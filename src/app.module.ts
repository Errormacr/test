import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HotelModule } from './hotel/hotel.module';

@Module({
  imports: [DatabaseModule, HotelModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ResponsibilitiesService } from './responsibilities.service';
import { ResponsibilitiesController } from './responsibilities.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [ResponsibilitiesController],
  providers: [ResponsibilitiesService],
})
export class ResponsibilitiesModule {}

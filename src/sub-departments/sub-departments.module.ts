import { Module } from '@nestjs/common';
import { SubDepartmentsService } from './sub-departments.service';
import { SubDepartmentsController } from './sub-departments.controller';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [SubDepartmentsController],
  providers: [SubDepartmentsService],
})
export class SubDepartmentsModule {}

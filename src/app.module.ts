import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { SubDepartmentsModule } from './sub-departments/sub-departments.module';
import { ResponsibilitiesModule } from './responsibilities/responsibilities.module';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [UsersModule, DatabaseModule, EmployeesModule, DepartmentsModule, SubDepartmentsModule, ResponsibilitiesModule, AssignmentModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { Prisma,DepartmentType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class DepartmentsService {
   constructor(private readonly databaseService: DatabaseService) {}
  create(createDepartmentDto: Prisma.DepartmentCreateInput) {
    return this.databaseService.department.create({
      data: createDepartmentDto,
    })
  }

  findAll(type?: DepartmentType) {
    if(type) return this.databaseService.department.findMany({
      where:{
        type,
      }
    })
    return this.databaseService.department.findMany();
  }

  findOne(id: number) {
    return this.databaseService.department.findUnique({
      where:{
        id,
      }
    })
  }

  update(id: number, updateDepartmentDto: Prisma.DepartmentUpdateInput) {
    return this.databaseService.department.update({
      where:{
        id,
      },
      data:updateDepartmentDto,
    })
  }

  remove(id: number) {
    return this.databaseService.department.delete({
      where:{
        id,
      }
    })
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma,SubDepartmentType } from '@prisma/client';
@Injectable()
export class SubDepartmentsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createSubDepartmentDto: Prisma.SubDepartmentCreateInput) {
    return this.databaseService.subDepartment.create({
      data: createSubDepartmentDto,
    })
  }

  async findAll(type?: SubDepartmentType) {
    if(type) return this.databaseService.subDepartment.findMany({
      where:{
        type,
      }
    })
    return this.databaseService.subDepartment.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.subDepartment.findUnique({
      where:{
        id,
      }
    })
  }

  async update(id: number, updateSubDepartmentDto: Prisma.SubDepartmentUpdateInput) {
    return  this.databaseService.subDepartment.update({
      where:{
        id,
      },
      data: updateSubDepartmentDto,
    })
  }

  async remove(id: number) {
    return this.databaseService.subDepartment.delete({
      where:{
        id,
      }
    })
  }
}

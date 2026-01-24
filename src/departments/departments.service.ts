import { Injectable } from '@nestjs/common';
import { Prisma, DepartmentType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

// Custom DTO to handle optional type field
interface CreateDepartmentDto {
  name: string;
  description?: string;
  type?: DepartmentType;
}

@Injectable()
export class DepartmentsService {
   constructor(private readonly databaseService: DatabaseService) {}
  create(createDepartmentDto: CreateDepartmentDto) {
    return this.databaseService.department.create({
      data: {
        name: createDepartmentDto.name,
        description: createDepartmentDto.description,
        type: createDepartmentDto.type || DepartmentType.TEACHING, // Default type
      },
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

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, SubDepartmentType } from '@prisma/client';

// Custom DTO to handle optional type field
interface CreateSubDepartmentDto {
  name: string;
  description?: string;
  departmentId: string | number;
  type?: SubDepartmentType;
}

@Injectable()
export class SubDepartmentsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createSubDepartmentDto: CreateSubDepartmentDto) {
    return this.databaseService.subDepartment.create({
      data: {
        name: createSubDepartmentDto.name,
        description: createSubDepartmentDto.description,
        type: createSubDepartmentDto.type || SubDepartmentType.SKILLS, // Default type
        department: {
          connect: { id: Number(createSubDepartmentDto.departmentId) }
        }
      },
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

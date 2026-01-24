import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SubDepartmentsService } from './sub-departments.service';
import { Prisma, SubDepartmentType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTO for creating sub-departments
interface CreateSubDepartmentDto {
  name: string;
  description?: string;
  departmentId: string | number;
  type?: SubDepartmentType;
}

@Controller('sub-departments')
export class SubDepartmentsController {
  constructor(private readonly subDepartmentsService: SubDepartmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSubDepartmentDto: CreateSubDepartmentDto) {
    return this.subDepartmentsService.create(createSubDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('type') type?:SubDepartmentType) {
    return this.subDepartmentsService.findAll(type);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.subDepartmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSubDepartmentDto: Prisma.SubDepartmentUpdateInput) {
    return this.subDepartmentsService.update(+id, updateSubDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.subDepartmentsService.remove(+id);
  }
}

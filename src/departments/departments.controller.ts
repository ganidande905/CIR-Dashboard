import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Prisma, DepartmentType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// DTO for creating departments
interface CreateDepartmentDto {
  name: string;
  description?: string;
  type?: DepartmentType;
}

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('type') type?:DepartmentType) {
    return this.departmentsService.findAll(type);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDepartmentDto: Prisma.DepartmentUpdateInput) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { SubDepartmentsService } from './sub-departments.service';
import { Prisma,SubDepartmentType } from '@prisma/client';

@Controller('sub-departments')
export class SubDepartmentsController {
  constructor(private readonly subDepartmentsService: SubDepartmentsService) {}

  @Post()
  create(@Body() createSubDepartmentDto: Prisma.SubDepartmentCreateInput) {
    return this.subDepartmentsService.create(createSubDepartmentDto);
  }

  @Get()
  findAll(@Query('type') type?:SubDepartmentType) {
    return this.subDepartmentsService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subDepartmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubDepartmentDto: Prisma.SubDepartmentUpdateInput) {
    return this.subDepartmentsService.update(+id, updateSubDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subDepartmentsService.remove(+id);
  }
}

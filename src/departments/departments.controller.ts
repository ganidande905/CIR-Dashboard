import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Prisma,  DepartmentType } from '@prisma/client';


@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() createDepartmentDto: Prisma.DepartmentCreateInput) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  findAll(@Query('type') type?:DepartmentType) {
    return this.departmentsService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepartmentDto: Prisma.DepartmentUpdateInput) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}

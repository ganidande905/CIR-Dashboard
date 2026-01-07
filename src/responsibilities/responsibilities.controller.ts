import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResponsibilitiesService } from './responsibilities.service';
import { Prisma, SubDepartmentType } from '@prisma/client';

@Controller('responsibilities')
export class ResponsibilitiesController {
  constructor(private readonly responsibilitiesService: ResponsibilitiesService) {}

  @Post()
  create(@Body() createResponsibilityDto: Prisma.ResponsibilityCreateInput) {
    return this.responsibilitiesService.create(createResponsibilityDto);
  }

  @Get()
  findAll(
    @Query('type') type?: SubDepartmentType,
    @Query('subDepartmentId') subDepartmentId?: string
  ) {
    return this.responsibilitiesService.findAll(
      type,
      subDepartmentId ? +subDepartmentId : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsibilitiesService.findOne(+id);
  }

  @Get(':id/employees')
  getAssignedEmployees(@Param('id') id: string) {
    return this.responsibilitiesService.getAssignedEmployees(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsibilityDto: Prisma.ResponsibilityUpdateInput) {
    return this.responsibilitiesService.update(+id, updateResponsibilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsibilitiesService.remove(+id);
  }
}
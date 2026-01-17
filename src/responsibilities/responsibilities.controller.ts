import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ResponsibilitiesService } from './responsibilities.service';
import { Prisma, SubDepartmentType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('responsibilities')
export class ResponsibilitiesController {
  constructor(private readonly responsibilitiesService: ResponsibilitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createResponsibilityDto: Prisma.ResponsibilityCreateInput) {
    return this.responsibilitiesService.create(createResponsibilityDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  findAll(@Request() req) {
    return this.responsibilitiesService.findAllScoped(
      req.user.id,
      req.user.role,
      req.user.subDepartmentId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.responsibilitiesService.findOne(+id);
  }

  @Get(':id/employees')
  @UseGuards(JwtAuthGuard)
  getAssignedEmployees(@Param('id') id: string) {
    return this.responsibilitiesService.getAssignedEmployees(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateResponsibilityDto: Prisma.ResponsibilityUpdateInput) {
    return this.responsibilitiesService.update(+id, updateResponsibilityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.responsibilitiesService.remove(+id);
  }
}
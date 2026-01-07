import { Controller, Get, Post, Body, Patch, Param, Delete,Query, Res } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import  {Prisma, Responsibility,Employee} from "@prisma/client";

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Body() createAssignmentDto: Prisma.ResponsibilityAssignmentCreateInput) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  findAll(
    @Query('responsibilityId') responsibilityId?: string,
    @Query('staffId') staffId?: string
  ) {
    return this.assignmentService.findAll(
      responsibilityId ? +responsibilityId : undefined,
      staffId ? +staffId : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignmentDto: Prisma.ResponsibilityAssignmentUpdateInput) {
    return this.assignmentService.update(+id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkSubmissionService } from './work-submission.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { VerifySubmissionDto } from './dto/verify-submission.dto';

@Controller('work-submission')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkSubmissionController {
  constructor(private readonly workSubmissionService: WorkSubmissionService) {}

  @Post()
  @Roles('ADMIN', 'STAFF')  // ← Changed: Removed MANAGER
  async create(
    @Body() createWorkSubmissionDto: Prisma.WorkSubmissionCreateInput,
    @Request() req,
  ) {
    return this.workSubmissionService.createProtected(
      createWorkSubmissionDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  findAll(
    @Query('staffId') staffId?: string,
    @Query('verifiedById') verifiedById?: string,
    @Query('assignmentId') assignmentId?: string,
    @Request() req?,
  ) {
    return this.workSubmissionService.findAllScoped(
      req.user.id,
      req.user.role,
      req.user.subDepartmentId,
      staffId ? +staffId : undefined,
      verifiedById ? +verifiedById : undefined,
      assignmentId ? +assignmentId : undefined,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workSubmissionService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkSubmissionDto: Prisma.WorkSubmissionUpdateInput,
    @Request() req,
  ) {
    // Use protected update to block verification fields
    return this.workSubmissionService.updateProtected(
      id,
      updateWorkSubmissionDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workSubmissionService.remove(id);
  }

  /**
   * NEW: Dedicated verification endpoint
   * Only ADMIN or MANAGER of same department can access
   */
  @Post(':id/verify')
  @Roles('ADMIN', 'MANAGER')
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyDto: VerifySubmissionDto,
    @Request() req,
  ) {
    return this.workSubmissionService.verifySubmission(
      id,
      req.user.id,
      req.user.role,
      req.user.subDepartmentId,  // ← Changed from departmentId
      verifyDto.managerComment || '',
      verifyDto.approved,
    );
  }
}

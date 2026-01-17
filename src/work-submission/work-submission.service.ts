import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WorkSubmissionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createWorkSubmissionDto: Prisma.WorkSubmissionCreateInput) {
    try {
      return await this.databaseService.workSubmission.create({
        data: createWorkSubmissionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Referenced record not found. Ensure assignment and staff IDs exist.',
          );
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'A work submission already exists for this assignment.',
          );
        }
      }
      throw error;
    }
  }

  async findAll(staffId?: number, verifiedById?: number, assignmentId?: number) {
    const where: Prisma.WorkSubmissionWhereInput = {};

    if (staffId) {
      where.staffId = staffId;
    }

    if (verifiedById) {
      where.verifiedById = verifiedById;
    }

    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    return this.databaseService.workSubmission.findMany({
      where,
      include: {
        assignment: {
          include: {
            responsibility: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.workSubmission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            responsibility: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateWorkSubmissionDto: Prisma.WorkSubmissionUpdateInput) {
    try {
      return await this.databaseService.workSubmission.update({
        where: { id },
        data: updateWorkSubmissionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Record not found. Ensure work submission ID and any referenced employee IDs exist.',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.databaseService.workSubmission.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Work submission with ID ${id} not found.`);
        }
      }
      throw error;
    }
  }

  /**
   * Scoped findAll - restricts data based on user role
   */
  async findAllScoped(
    userId: number,
    userRole: string,
    userSubDepartmentId: number | null,
    staffId?: number,
    verifiedById?: number,
    assignmentId?: number,
  ) {
    const where: any = {};

    // STAFF: Only their own submissions
    if (userRole === 'STAFF') {
      where.staffId = userId;
    }

    // MANAGER: Only their sub-department submissions
    if (userRole === 'MANAGER') {
      if (!userSubDepartmentId) {
        return []; // No sub-department assigned, return empty
      }
      where.assignment = {
        responsibility: {
          subDepartmentId: userSubDepartmentId,
        },
      };
    }

    // ADMIN: No restrictions

    // Apply optional filters
    if (staffId) where.staffId = staffId;
    if (verifiedById) where.verifiedById = verifiedById;
    if (assignmentId) where.assignmentId = assignmentId;

    return this.databaseService.workSubmission.findMany({
      where,
      include: {
        assignment: {
          include: {
            responsibility: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Verify a work submission - restricted to ADMIN or MANAGER of same department
   */
  async verifySubmission(
    submissionId: number,
    verifierId: number,
    verifierRole: string,
    verifierSubDepartmentId: number | null,
    managerComment: string,
    approved: boolean,
  ) {
    // 1. Get submission with full chain
    const submission = await this.databaseService.workSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            responsibility: {
              include: {
                subDepartment: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Work submission with ID ${submissionId} not found`);
    }

    // 2. Check if already verified
    if (submission.verifiedAt) {
      throw new BadRequestException('This submission has already been verified');
    }

    // 3. Get the sub-department this submission belongs to
    const submissionSubDepartmentId = submission.assignment?.responsibility?.subDepartmentId;

    // 4. Authorization check
    if (verifierRole === 'STAFF') {
      throw new ForbiddenException('Staff cannot verify submissions');
    }

    if (verifierRole === 'MANAGER') {
      if (!submissionSubDepartmentId || !verifierSubDepartmentId) {
        throw new ForbiddenException('Cannot determine sub-department for verification');
      }
      if (submissionSubDepartmentId !== verifierSubDepartmentId) {
        throw new ForbiddenException('Managers can only verify submissions within their sub-department');
      }
    }
    // ADMIN can verify any submission

    // 5. Update submission and assignment status
    const newStatus = approved ? 'VERIFIED' : 'REJECTED';

    return this.databaseService.$transaction([
      this.databaseService.workSubmission.update({
        where: { id: submissionId },
        data: {
          verifiedAt: new Date(),
          verifiedById: verifierId,
          managerComment,
        },
      }),
      this.databaseService.responsibilityAssignment.update({
        where: { id: submission.assignmentId },
        data: {
          status: newStatus,
        },
      }),
    ]);
  }

  /**
   * Protected update - prevents verification fields from being set directly
   */
  async updateProtected(
    id: number,
    updateDto: Prisma.WorkSubmissionUpdateInput,
    userId: number,
    userRole: string,
  ) {
    // Block verification fields from regular update
    if (
      updateDto.verifiedAt !== undefined ||
      updateDto.verifiedBy !== undefined
    ) {
      if (userRole === 'STAFF') {
        throw new ForbiddenException('Staff cannot set verification fields');
      }
      // For MANAGER/ADMIN, redirect to proper verification flow
      throw new BadRequestException(
        'Use POST /work-submission/:id/verify endpoint to verify submissions',
      );
    }

    // Staff can only update their own submissions
    if (userRole === 'STAFF') {
      const submission = await this.findOne(id);
      if (!submission) {
        throw new NotFoundException(`Work submission with ID ${id} not found`);
      }
      if (submission.staffId !== userId) {
        throw new ForbiddenException('Staff can only update their own submissions');
      }
    }

    return this.update(id, updateDto);
  }

  /**
   * Protected create - ensures staff can only submit their own work
   */
  async createProtected(
    createWorkSubmissionDto: Prisma.WorkSubmissionCreateInput,
    userId: number,
    userRole: string,
  ) {
    // 1. Extract staffId from the DTO
    const staffIdFromDto = (createWorkSubmissionDto.staff as any)?.connect?.id;

    if (!staffIdFromDto) {
      throw new BadRequestException('Staff ID is required');
    }

    // 2. STAFF can only submit their own work
    if (userRole === 'STAFF') {
      if (staffIdFromDto !== userId) {
        throw new ForbiddenException('Staff can only submit their own work');
      }
    }

    // 3. MANAGER cannot submit work submissions
    if (userRole === 'MANAGER') {
      throw new ForbiddenException('Managers cannot submit work. Only verify.');
    }

    // 4. Verify assignment exists and belongs to this staff
    const assignmentId = (createWorkSubmissionDto.assignment as any)?.connect?.id;

    if (!assignmentId) {
      throw new BadRequestException('Assignment ID is required');
    }

    const assignment = await this.databaseService.responsibilityAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }

    if (assignment.staffId !== staffIdFromDto) {
      throw new ForbiddenException('Cannot submit work for an assignment not assigned to this staff');
    }

    // 5. Check if submission already exists for this assignment
    const existingSubmission = await this.databaseService.workSubmission.findFirst({
      where: { assignmentId },
    });

    if (existingSubmission) {
      throw new BadRequestException('Work submission already exists for this assignment. Use update instead.');
    }

    // 6. Create the submission
    return this.create(createWorkSubmissionDto);
  }
}

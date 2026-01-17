import { Injectable } from '@nestjs/common';
import { Prisma, SubDepartmentType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ResponsibilitiesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createResponsibilityDto: Prisma.ResponsibilityCreateInput) {
    return this.databaseService.responsibility.create({
      data: createResponsibilityDto,
    });
  }

  // Filter responsibilities by SubDepartment type
  async findAll(type?: SubDepartmentType, subDepartmentId?: number) {
    const where: Prisma.ResponsibilityWhereInput = {};

    // Filter by subdepartment type
    if (type) {
      where.subDepartment = {
        type,
      };
    }

    // Filter by specific subdepartment ID
    if (subDepartmentId) {
      where.subDepartmentId = subDepartmentId;
    }

    return this.databaseService.responsibility.findMany({
      where,
      include: {
        subDepartment: true, // Include subdepartment details
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            workSubmission: true,
          },
        },
      },
    });
  }

  async findAllByDepartment(userDepartmentId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      return this.databaseService.responsibility.findMany();
    }
    // Manager/Staff: only their department
    return this.databaseService.responsibility.findMany({
      where: {
        subDepartment: {
          departmentId: userDepartmentId,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.responsibility.findUnique({
      where: {
        id,
      },
      include: {
        subDepartment: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            workSubmission: true,
          },
        },
        subResponsibilities: true,
        parent: true,
      },
    });
  }

  async update(id: number, updateResponsibilityDto: Prisma.ResponsibilityUpdateInput) {
    return this.databaseService.responsibility.update({
      where: {
        id,
      },
      data: updateResponsibilityDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.responsibility.delete({
      where: {
        id,
      },
    });
  }

  // Get all employees assigned to a responsibility
  async getAssignedEmployees(responsibilityId: number) {
    return this.databaseService.responsibilityAssignment.findMany({
      where: {
        responsibilityId,
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            jobTitle: true,
          },
        },
        workSubmission: true,
      },
    });
  }

  /**
   * Scoped findAll - restricts based on user role
   */
  async findAllScoped(
    userId: number,
    userRole: string,
    userSubDepartmentId: number | null,
  ) {
    const where: any = {};

    // STAFF: Only responsibilities assigned to them
    if (userRole === 'STAFF') {
      where.assignments = {
        some: {
          staffId: userId,
        },
      };
    }

    // MANAGER: Only their sub-department responsibilities
    if (userRole === 'MANAGER') {
      if (!userSubDepartmentId) {
        return [];
      }
      where.subDepartmentId = userSubDepartmentId;
    }

    // ADMIN: No restrictions

    return this.databaseService.responsibility.findMany({
      where,
      include: {
        subDepartment: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
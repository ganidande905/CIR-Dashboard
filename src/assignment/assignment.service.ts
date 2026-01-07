import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createAssignmentDto: Prisma.ResponsibilityAssignmentCreateInput) {
    return this.prisma.responsibilityAssignment.create({
      data: createAssignmentDto,
    });
  }

  findAll(responsibilityId?: number, staffId?: number) {
    return this.prisma.responsibilityAssignment.findMany({
      where: {
        ...(responsibilityId && { responsibilityId }),
        ...(staffId && { staffId }),
      },
      include: {
        responsibility: true,
        staff: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.responsibilityAssignment.findUnique({
      where: { id },
      include: {
        responsibility: true,
        staff: true,
      },
    });
  }

  update(id: number, updateAssignmentDto: Prisma.ResponsibilityAssignmentUpdateInput) {
    return this.prisma.responsibilityAssignment.update({
      where: { id },
      data: updateAssignmentDto,
    });
  }

  remove(id: number) {
    return this.prisma.responsibilityAssignment.delete({
      where: { id },
    });
  }
}

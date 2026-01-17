import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class VerifySubmissionDto {
  @IsBoolean()
  approved: boolean;

  @IsString()
  @IsOptional()
  managerComment?: string;
}
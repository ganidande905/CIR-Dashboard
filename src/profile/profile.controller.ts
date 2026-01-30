"use strict";

import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProfileService } from './profile.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @Roles('ADMIN', 'MANAGER', 'STAFF')
    async getProfile(@Request() req) {
        return this.profileService.getProfile(req.user.id);
    }

    @Post('avatar')
    @Roles('ADMIN', 'MANAGER', 'STAFF')
    async updateAvatar(
        @Request() req,
        @Body() updateAvatarDto: UpdateAvatarDto
    ) {
        return this.profileService.updateAvatar(req.user.id, updateAvatarDto);
    }
}

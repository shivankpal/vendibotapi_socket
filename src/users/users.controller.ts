import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService){

    }
    
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.username);
        return {status: 200, message: '', data: { user }}
    }
}

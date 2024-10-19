import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserInterceptor } from '../interceptors/users.interceptor';
import { CreateUserDto } from '../dto/create.user.dto';
import { Request } from 'express';
import { authPayload } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }
  
  @UseInterceptors(UserInterceptor)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  @UseInterceptors(UserInterceptor)
  getProfile(
    @Req() request: Request
  ) {
    const userPayload: authPayload = request['user']
    return this.usersService.getProfile(userPayload)
  }

}

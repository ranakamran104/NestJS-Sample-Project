import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('User Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('api_key')
  @Post('/addUsers')
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('api_key')
  @Get('/all-user')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users fetched successfully.' })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('api_key')
  @Get('/user/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User fetched successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('api_key')
  @Patch('/update-profile/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('api_key')
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ description: 'User logged in successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const { user, token } = await this.userService.login(email, password);
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-password')
  @ApiBearerAuth('api_key')
  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({ description: 'Password updated successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async updatePassword(
    @Req() req: Request,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    const id = req['user'].id;

    try {
      await this.userService.updatePassword(id, oldPassword, newPassword);
      throw new HttpException('Password changed successfully', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ description: 'Password reset email sent.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.userService.forgotPassword(email);
      throw new HttpException('Password reset email sent', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ description: 'Password reset successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid token or password.' })
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.userService.resetPassword(token, newPassword);
      throw new HttpException('Password reset successfully', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

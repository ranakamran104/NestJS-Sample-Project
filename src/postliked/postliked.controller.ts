import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostlikedService } from './postliked.service';
import { CreatePostlikedDto } from './dto/create-postliked.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Post Liked')
@ApiBearerAuth('api_key')
@Controller('postliked')
export class PostlikedController {
  constructor(private readonly postlikedService: PostlikedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create post liked' })
  @ApiCreatedResponse({ description: 'Liked created successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createPostlikedDto: CreatePostlikedDto, @Req() req: Request) {
    try {
      const userId = req['user'].id;
      return this.postlikedService.create(createPostlikedDto, userId);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all likeds' })
  @ApiOkResponse({ description: 'Likeds fetched successfully.' })
  findAll() {
    return this.postlikedService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a liked by ID' })
  @ApiOkResponse({ description: 'Liked fetched successfully.' })
  @ApiNotFoundResponse({ description: 'Liked not found.' })
  findOne(@Param('id') id: string) {
    return this.postlikedService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePostlikedDto: UpdatePostlikedDto,
  // ) {
  //   try {
  //     return this.postlikedService.update(id, updatePostlikedDto);
  //   } catch (error) {
  //     throw new HttpException(
  //       'Internal Server Error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a liked' })
  @ApiOkResponse({ description: 'Liked deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Liked not found.' })
  remove(@Param('id') id: string) {
    return this.postlikedService.remove(id);
  }
}

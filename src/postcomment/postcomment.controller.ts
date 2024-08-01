import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostcommentService } from './postcomment.service';
import { CreatePostcommentDto } from './dto/create-postcomment.dto';
import { UpdatePostcommentDto } from './dto/update-postcomment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Post Comment')
@ApiBearerAuth('api_key')
@UseGuards(JwtAuthGuard)
@Controller('postcomment')
export class PostcommentController {
  constructor(private readonly postcommentService: PostcommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create post comment' })
  @ApiCreatedResponse({ description: 'Comment created successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(
    @Body() createPostcommentDto: CreatePostcommentDto,
    @Req() req: Request,
  ) {
    try {
      const userId = req['user'].id;
      return this.postcommentService.create(userId, createPostcommentDto);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ description: 'Comments fetched successfully.' })
  findAll() {
    return this.postcommentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiOkResponse({ description: 'Comment fetched successfully.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  findOne(@Param('id') id: string) {
    return this.postcommentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiOkResponse({ description: 'Comment updated successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  update(
    @Param('id') id: string,
    @Body() updatePostcommentDto: UpdatePostcommentDto,
  ) {
    try {
      return this.postcommentService.update(id, updatePostcommentDto);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiOkResponse({ description: 'Comment deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  remove(@Param('id') id: string) {
    return this.postcommentService.remove(id);
  }
}

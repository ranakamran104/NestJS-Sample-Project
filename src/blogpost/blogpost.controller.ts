import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { CreateBlogpostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('BlogPost')
@ApiBearerAuth('api_key')
@UseGuards(JwtAuthGuard)
@Controller('blogpost')
export class BlogpostController {
  constructor(private readonly blogpostService: BlogpostService) {}

  @Post()
  @ApiOperation({ summary: 'Create blog post' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(
    @Body() createBlogpostDto: CreateBlogpostDto,
    @Req() req: Request,
  ) {
    try {
      const userId = req['user'].id;
      const newPost = await this.blogpostService.create(
        createBlogpostDto,
        userId,
      );
      return { newPost };
    } catch (error) {
      if (error.message === 'Post already created') {
        throw new HttpException('Post already created', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog post' })
  @ApiOkResponse({
    description: 'Fectched Successfully',
  })
  async findAll() {
    try {
      const posts = await this.blogpostService.findAll();
      return { data: posts };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiOkResponse({
    description: 'Fectched Successfully',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const post = await this.blogpostService.findOne(id);
      return post;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiOkResponse({
    description: 'Updated Successfully',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() updateBlogpostDto: UpdateBlogpostDto,
  ) {
    return this.blogpostService.update(id, updateBlogpostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiOkResponse({
    description: 'Deleted Successfully',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  remove(@Param('id') id: string) {
    return this.blogpostService.remove(id);
  }
}

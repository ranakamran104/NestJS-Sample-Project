import { PartialType } from '@nestjs/mapped-types';
import { CreatePostlikedDto } from './create-postliked.dto';

export class UpdatePostlikedDto extends PartialType(CreatePostlikedDto) {}

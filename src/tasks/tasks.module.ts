import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [TasksService],
})
export class TasksModule {}

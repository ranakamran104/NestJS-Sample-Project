import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.debug('Called every 5 minutes');
    try {
      const categories = await this.categoryService.findAll();
      this.logger.debug('Categories:', categories);
    } catch (error) {
      this.logger.error('Failed to retrieve categories', error.stack);
    }
  }

  @Interval(60000)
  handleInterval() {
    this.logger.debug('Called every 1 minute');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }
}

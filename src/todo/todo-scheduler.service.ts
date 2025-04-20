import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TodoService } from './todo.service';

@Injectable()
export class TodoSchedulerService {
  private readonly logger = new Logger(TodoSchedulerService.name);

  constructor(private readonly todoService: TodoService) {}

  @Cron('0 5 * * *', {
    timeZone: 'Asia/Seoul', // KST timezone
  })
  async handleDeleteOldTodos() {
    this.logger.log('Running scheduled task: deleteOldTodos');
    try {
      const result = await this.todoService.deleteOldTodos();
      this.logger.log(`Successfully deleted ${result.affected} old todos`);
    } catch (error) {
      this.logger.error('Failed to delete old todos', error.stack);
    }
  }
} 
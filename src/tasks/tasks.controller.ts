import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { GetTasksFilterDTO } from './dto/get-tasksFilter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { getUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksServices: TasksService) {}

  @Get()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDTO,
    @getUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retriev all tasks .`);
    return this.tasksServices.getAllTasks(filterDto, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @getUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} create new task with title ${JSON.stringify(createTaskDto.title)} .`,
    );
    return this.tasksServices.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @getUser() user: User): Promise<Task> {
    return this.tasksServices.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @getUser() user: User): Promise<void> {
    return this.tasksServices.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @getUser() user: User,
  ): Promise<Task> {
    return this.tasksServices.updateTask(id, status, user);
  }
}

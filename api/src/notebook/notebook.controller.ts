import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { Task } from './notebook.entity';

@Controller('notebooks')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Get()
  async getAllNotebooks(): Promise<Task[]> {
    return this.notebookService.getNotebooks();
  }

  @Get(':id')
  async getNotebook(@Param('id') id: string): Promise<Task> {
    return this.notebookService.getNotebookById(id);
  }

  @Post()
  async createNotebook(
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Task> {
    return this.notebookService.createNotebook(title, content);
  }

  @Put(':id')
  async updateNotebook(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Task> {
    return this.notebookService.updateNotebook(id, { title, description:content  });
  }

  @Delete(':id')
  async deleteNotebook(@Param('id') id: string): Promise<void> {
    return this.notebookService.deleteNotebook(id);
  }
}
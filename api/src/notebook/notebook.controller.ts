import { Controller, Get, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { Task } from './notebook.entity';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';
import { Request } from 'express';

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

  @Get('user/notebooks/:userId')
  async getUserNotebooks(@Param('userId') userId: string): Promise<Task[]> {
    return this.notebookService.getUserTasks(userId);
  }

 
@Post('/create')
  async createNotebook(
    @Body() createNotebookInput: CreateNotebookInput,
    @Req() req: Request & { user?: { id: string } },
  ): Promise<Task> {
    const userId = req.user?.id;
    return this.notebookService.createNotebook(createNotebookInput, userId);
  }

  @Put(':id')
async updateNotebook(
    @Param('id') id: string,
    @Body() updateNotebookInput: UpdateNotebookInput,
    @Req() req: Request & { user?: { id: string } },
  ): Promise<Task> {
    const userId = req.user?.id;
    return this.notebookService.updateNotebook({ id, ...updateNotebookInput }, userId);
  }

  @Delete(':id')
  async deleteNotebook(@Param('id') id: string, @Req() req: Request & {user?: {id:string}}): Promise<void> {
    const userId = req.user?.id;
    return this.notebookService.deleteNotebook(id, userId);
  }
}
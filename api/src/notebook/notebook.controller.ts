import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { Task } from './notebook.entity';
import { CreateNotebookInput } from '../dto/create-notebook.input'; // Assicurati che i DTO siano corretti
import { UpdateNotebookInput } from '../dto/update-notebook.input';

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

  @Post('/create')
  async createNotebook(
    @Body() createNotebookInput: CreateNotebookInput, // Usa DTO per i dati di input
  ): Promise<Task> {
    return this.notebookService.createNotebook(createNotebookInput);
  }

  @Put(':id')
  async updateNotebook(
    @Param('id') id: string,
    @Body() updateNotebookInput: UpdateNotebookInput
  ): Promise<Task> {
    return this.notebookService.updateNotebook({ id, ...updateNotebookInput });
  }


  @Delete(':id')
  async deleteNotebook(@Param('id') id: string): Promise<void> {
    return this.notebookService.deleteNotebook(id);
  }
}
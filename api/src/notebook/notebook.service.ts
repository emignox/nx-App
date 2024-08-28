import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './notebook.entity';
import { ObjectId, MongoEntityManager } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';

@Injectable()
export class NotebookService {
  private readonly em: MongoEntityManager;

  constructor(private readonly orm: MikroORM) {
    this.em = this.orm.em as MongoEntityManager;
  }

  async createNotebook(createNotebookInput: CreateNotebookInput): Promise<Task> {
    const { title, content } = createNotebookInput;
    const notebook = new Task();
    notebook.title = title;
    notebook.content = content; // Assicurati che 'content' sia corretto
    await this.em.persistAndFlush(notebook);
    return notebook;
  }

  async getNotebookById(id: string): Promise<Task> {
    const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    return notebook;
  }

  async getNotebooks(): Promise<Task[]> {
    return this.em.find(Task, {});
  }

  async updateNotebook(updateNotebookInput: UpdateNotebookInput): Promise<Task> {
    const { id, title, content } = updateNotebookInput;
    const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    if (title) notebook.title = title;
    if (content) notebook.content = content; // Assicurati che 'content' sia corretto
    await this.em.flush();
    return notebook;
  }

  async deleteNotebook(id: string): Promise<void> {
    const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    await this.em.removeAndFlush(notebook);
  }
}
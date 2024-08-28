import { Injectable } from '@nestjs/common';
import { Task } from './notebook.entity';
import { ObjectId,  MongoEntityManager } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class NotebookService {
  private readonly em: MongoEntityManager;

  constructor(
    private readonly orm: MikroORM, // Inietta MikroORM per accedere al MongoEntityManager
  ) {
    this.em = this.orm.em as MongoEntityManager; // Cast a MongoEntityManager
  }

  async createNotebook(title: string, description: string): Promise<Task> {
    const notebook = new Task();
    notebook.title = title;
    notebook.description = description;
    await this.em.persistAndFlush(notebook); // Usa em.persistAndFlush() con MongoEntityManager
    return notebook;
  }
  async getNotebookById(id: string): Promise<Task> {
    return this.em.findOne(Task, { _id: new ObjectId(id) }); // Usa em.findOne() con MongoEntityManager
  }

  async getNotebooks(): Promise<Task[]> {
    return this.em.find(Task, {}); // Usa em.find() con MongoEntityManager
  }

  async updateNotebook(id: string, updateData: Partial<Task>): Promise<Task> {
    const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
    if (notebook) {
      this.em.assign(notebook, updateData);
      await this.em.flush();
      return notebook;
    }
    throw new Error('Notebook not found');
  }
  async deleteNotebook(id: string): Promise<void> {
    const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
    if (notebook) {
      await this.em.removeAndFlush(notebook);
    } else {
      throw new Error('Notebook not found');
    }
}
}
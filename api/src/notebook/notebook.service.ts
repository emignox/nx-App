// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task } from './notebook.entity';
// import { MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
// import { MikroORM } from '@mikro-orm/core';
// import { CreateNotebookInput } from '../dto/create-notebook.input';
// import { UpdateNotebookInput } from '../dto/update-notebook.input';

// @Injectable()
// export class NotebookService {
//   private readonly em: MongoEntityManager;

//   constructor(private readonly orm: MikroORM) {
//     this.em = this.orm.em as MongoEntityManager;
//   }

//   async createNotebook(createNotebookInput: CreateNotebookInput): Promise<Task> {
//     const { title, content } = createNotebookInput;
//     const notebook = new Task();
//     notebook.title = title;
//     notebook.content = content;
//     await this.em.persistAndFlush(notebook);
//     return notebook;
//   }

//   async getNotebookById(_id: string): Promise<Task> {
//     const notebook = await this.em.findOne(Task, { _id: new ObjectId(_id) });
//     if (!notebook) {
//       throw new NotFoundException(`Notebook with ID ${_id} not found`);
//     }
//     return notebook;
//   }

//   async getNotebooks(): Promise<Task[]> {
//     return this.em.find(Task, {});
//   }

//   async updateNotebook(updateNotebookInput: UpdateNotebookInput): Promise<Task> {
//     const { id, title, content } = updateNotebookInput;
//     const notebook = await this.em.findOne(Task, { _id: new ObjectId(id) });
//     if (!notebook) {
//       throw new NotFoundException(`Notebook with ID ${id} not found`);
//     }
//     if (title) notebook.title = title;
//     if (content !== undefined) notebook.content = content; // Aggiorna solo se content è definito
//     await this.em.flush();
//     return notebook;
//   }

//   async deleteNotebook(_id: string): Promise<void> {
//     const notebook = await this.em.findOne(Task, { _id: new ObjectId(_id) });
//     if (!notebook) {
//       throw new NotFoundException(`Notebook with ID ${_id} not found`);
//     }
//     await this.em.removeAndFlush(notebook);
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './notebook.entity';
import { MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';

@Injectable()
export class NotebookService {
  constructor(private readonly orm: MikroORM) {}

  private get em(): EntityManager {
    return this.orm.em.fork(); // Usa il metodo fork() per creare un nuovo EntityManager per il contesto specifico
  }

  async createNotebook(createNotebookInput: CreateNotebookInput): Promise<Task> {
    const em = this.em; // Ottieni l'EntityManager locale
    const { title, content } = createNotebookInput;
    const notebook = new Task();
    notebook.title = title;
    notebook.content = content;
    await em.persistAndFlush(notebook);
    return notebook;
  }

  async getNotebookById(_id: string): Promise<Task> {
    const em = this.em; // Ottieni l'EntityManager locale
    const notebook = await em.findOne(Task, { _id: new ObjectId(_id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${_id} not found`);
    }
    return notebook;
  }

  async getNotebooks(): Promise<Task[]> {
    const em = this.em; // Ottieni l'EntityManager locale
    return em.find(Task, {});
  }

  async updateNotebook(updateNotebookInput: UpdateNotebookInput): Promise<Task> {
    const em = this.em; // Ottieni l'EntityManager locale
    const { id, title, content } = updateNotebookInput;
    const notebook = await em.findOne(Task, { _id: new ObjectId(id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    if (title) notebook.title = title;
    if (content !== undefined) notebook.content = content; // Aggiorna solo se content è definito
    await em.flush();
    return notebook;
  }

  async deleteNotebook(_id: string): Promise<void> {
    const em = this.em; // Ottieni l'EntityManager locale
    const notebook = await em.findOne(Task, { _id: new ObjectId(_id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${_id} not found`);
    }
    await em.removeAndFlush(notebook);
  }
}
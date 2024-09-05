import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './notebook.entity';
import { MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';
import { User } from '../user/user.entity';

@Injectable()
export class NotebookService {
  constructor(private readonly orm: MikroORM) {}

  private get em(): EntityManager {
    return this.orm.em.fork(); // Usa il metodo fork() per creare un nuovo EntityManager per il contesto specifico
  }

  // Funzione per ottenere tutte le note di un utente specifico
  async getUserTasks(userId: string): Promise<Task[]> {
    const tasks = await this.em.find(Task, { user: new ObjectId(userId) });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No tasks found for user,  create your new first Note 😄`);
    }

    return tasks;
  }

  // Creazione di una nuova nota associata all'utente
  async createNotebook(createNotebookInput: CreateNotebookInput, userId: string): Promise<Task> {
    const em = this.em;
    const { title, content } = createNotebookInput;
    const user = await em.findOne(User, { _id: new ObjectId(userId) });
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const notebook = new Task();
    notebook.title = title;
    notebook.content = content;
    notebook.user = user;

    await em.persistAndFlush(notebook);
    return notebook;
  }

  // Recupera una singola nota per ID
  async getNotebookById(id: string): Promise<Task> {
    const em = this.em;
    const notebook = await em.findOne(Task, { _id: new ObjectId(id) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }
    return notebook;
  }

  // Recupera tutte le note
  async getNotebooks(): Promise<Task[]> {
    const em = this.em;
    return em.find(Task, {});
  }

  // Aggiorna una nota esistente
  async updateNotebook(updateNotebookInput: UpdateNotebookInput, userId: string): Promise<Task> {
    const em = this.em;
    const { id, title, content } = updateNotebookInput;

    const notebook = await em.findOne(Task, { _id: new ObjectId(id), user: new ObjectId(userId) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found for user with ID ${userId}`);
    }

    if (title) notebook.title = title;
    if (content !== undefined) notebook.content = content;

    await em.flush();
    return notebook;
  }

  // Elimina una nota
  async deleteNotebook(id: string, userId: string): Promise<void> {
    const em = this.em;
    const notebook = await em.findOne(Task, { _id: new ObjectId(id), user: new ObjectId(userId) });
    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found for user with ID ${userId}`);
    }
    await em.removeAndFlush(notebook);
  }
}

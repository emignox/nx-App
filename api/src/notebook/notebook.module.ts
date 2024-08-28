import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotebookService } from './notebook.service';
import { NotebookController } from './notebook.controller';
import { Task } from './notebook.entity';
import { defineConfig } from '@mikro-orm/mongodb';

@Module({
  imports: [
    MikroOrmModule.forRoot(defineConfig({
      clientUrl: 'mongodb://localhost:27017/notebook-management', // URL del database MongoDB
      entities: [Task], // Le entità che MikroORM gestirà
      dbName: 'notebook-management', // Nome del database
    })),
    MikroOrmModule.forFeature([Task]), // Configurazione dell'entità Task per MikroORM
  ],
  providers: [NotebookService],
  controllers: [NotebookController],
})
export class NotebookModule {}
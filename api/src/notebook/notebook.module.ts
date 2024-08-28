import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotebookService } from './notebook.service';
import { NotebookController } from './notebook.controller';
import { Task } from './notebook.entity';
import { defineConfig } from '@mikro-orm/mongodb';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { NotebookResolver } from './notebook.resolver';



@Module({
  imports: [
    MikroOrmModule.forRoot(defineConfig({
      clientUrl: 'mongodb://localhost:27017/notebook-management', // URL del database MongoDB
      entities: [Task], // Le entità che MikroORM gestirà
      dbName: 'notebook-management', // Nome del database
    })),
    MikroOrmModule.forFeature([Task]), // Configurazione dell'entità Task per MikroORM
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Configura il driver Apollo
      autoSchemaFile: true, // Genera automaticamente il file di schema
      playground: true, // Abilita GraphQL Playground per testare le query
    })],
  providers: [NotebookService, NotebookResolver],
  controllers: [NotebookController],
})
export class NotebookModule {}
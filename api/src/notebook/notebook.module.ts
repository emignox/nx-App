import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotebookService } from './notebook.service';
import { NotebookController } from './notebook.controller';
import { Task } from './notebook.entity';
import { defineConfig } from '@mikro-orm/mongodb';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { NotebookResolver } from './notebook.resolver';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'; // Importa il modulo User
import { User } from '../user/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();



@Module({
  imports: [
    MikroOrmModule.forRoot(defineConfig({
      clientUrl: 'mongodb://localhost:27017/notebook-management',
      entities: [Task, User], // Gestisci entrambe le entità
      dbName: 'notebook-management',
    })),
    MikroOrmModule.forFeature([Task]), // Configura l'entità Task per MikroORM
    UserModule, // Importa UserModule qui
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }) => {
        const token = req.headers.authorization || '';
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'default_secret' });
        let user = null;
    
        if (token) {
          try {
            user = jwtService.verify(token.replace('Bearer ', ''));
          } catch (err) {
            console.warn('JWT verification failed:', err.message);
          }
        }
    
        return { user };
      },
      
    }),
  ],
  providers: [NotebookService, NotebookResolver],
  controllers: [NotebookController],
})
export class NotebookModule {}

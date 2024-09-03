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
import { UserModule } from '../user/user.module';
import { User } from '../user/user.entity';
import * as dotenv from 'dotenv';
import { PubSub } from 'graphql-subscriptions';

dotenv.config();
@Module({
  imports: [
    MikroOrmModule.forRoot(defineConfig({
      clientUrl: 'mongodb://localhost:27017/notebook-management',
      entities: [Task, User],
      dbName: 'notebook-management',
    })),
    MikroOrmModule.forFeature([Task]),
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true, // Ensure the correct protocol is used
      },
      context: ({ req, connection }) => {
        let user = null;
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'default_secret' });
      
        if (connection) {
          // For WebSocket connections
          const token = connection.context.authToken;
          if (token) {
            try {
              user = jwtService.verify(token.replace('Bearer ', ''));
            } catch (err) {
              console.warn('JWT verification failed:', err.message);
            }
          }
        } else if (req) {
          // For HTTP requests
          const token = req.headers.authorization || '';
          if (token) {
            try {
              user = jwtService.verify(token.replace('Bearer ', ''));
            } catch (err) {
              console.warn('JWT verification failed:', err.message);
            }
          }
        }
      
        return { user };
      },
      
    }),
  ],
  providers: [NotebookService, NotebookResolver, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  controllers: [NotebookController],
})
export class NotebookModule {}
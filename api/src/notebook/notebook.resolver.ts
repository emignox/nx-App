import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotebookService } from './notebook.service';
import { NotebookType } from './notebook.type';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';

const pubSub = new PubSub();
const NOTEBOOK_CREATED = 'NOTEBOOK_CREATED';

@Resolver(() => NotebookType)
export class NotebookResolver {
  constructor(private readonly notebookService: NotebookService) {}

  @Query(() => [NotebookType])
  async notebooks() {
    return this.notebookService.getNotebooks();
  }

  @Query(() => NotebookType, { name: 'notebook' })
  async getNotebookById(@Args('id') id: string) {
    return this.notebookService.getNotebookById(id);
  }

  @Mutation(() => NotebookType)
  async createNotebook(
    @Args('createNotebookInput') createNotebookInput: CreateNotebookInput,
  ) {
    const notebook = await this.notebookService.createNotebook(createNotebookInput);
    pubSub.publish(NOTEBOOK_CREATED, { notebookCreated: notebook });
    return notebook;
  }

  @Mutation(() => NotebookType)
  async updateNotebook(
    @Args('updateNotebookInput') updateNotebookInput: UpdateNotebookInput,
  ) {
    return this.notebookService.updateNotebook(updateNotebookInput);
  }

  @Mutation(() => Boolean)
  async deleteNotebook(@Args('id') id: string) {
    await this.notebookService.deleteNotebook(id);
    return true;
  }

  @Subscription(() => NotebookType, {
    resolve: (payload) => payload.notebookCreated,
  })
  notebookCreated() {
    return pubSub.asyncIterator(NOTEBOOK_CREATED);
  }
}
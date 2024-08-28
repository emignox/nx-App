import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotebookService } from './notebook.service';
import { NotebookType } from './notebook.type';

@Resolver(of => NotebookType)
export class NotebookResolver {
  constructor(private readonly notebookService: NotebookService) {}

  @Query(() => [NotebookType])
  async notebooks() {
    return this.notebookService.getNotebooks();
  }

  @Mutation(() => NotebookType)
  async createNotebook(
    @Args('title') title: string,
    @Args('content') content: string,
  ) {
    return this.notebookService.createNotebook(title, content);
  }
}
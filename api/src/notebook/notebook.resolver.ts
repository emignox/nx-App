import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotebookService } from './notebook.service';
import { NotebookType } from './notebook.type';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';

@Resolver(() => NotebookType)
export class NotebookResolver {
  constructor(private readonly notebookService: NotebookService) {}

  @Query(() => [NotebookType])
  async notebooks() {
    return this.notebookService.getNotebooks();
  }

  @Mutation(() => NotebookType)
  async createNotebook(
    @Args('createNotebookInput') createNotebookInput: CreateNotebookInput,
  ) {
    return this.notebookService.createNotebook(createNotebookInput);
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
}
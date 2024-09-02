import { Resolver, Query, Mutation, Args, Context,  } from '@nestjs/graphql';
import { NotebookService } from './notebook.service';
import { NotebookType } from './notebook.type';
import { CreateNotebookInput } from '../dto/create-notebook.input';
import { UpdateNotebookInput } from '../dto/update-notebook.input';
import { UnauthorizedException ,NotFoundException } from '@nestjs/common';

interface MyContext {
  user?: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  };
  req: Request; // Se vuoi includere la richiesta HTTP
}


@Resolver(() => NotebookType)
export class NotebookResolver {
  constructor(private readonly notebookService: NotebookService) {}

  @Query(() => [NotebookType])
  async getAllNotebooks() {
    return this.notebookService.getNotebooks();
  }

  @Query(() => NotebookType)
  async getNotebook(@Args('id') id: string) {
    return this.notebookService.getNotebookById(id);
  }

@Query(() => NotebookType)
async getUserNotebook(@Args('id') id: string, @Context() context: MyContext): Promise<NotebookType> {
    const userId = context.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const notebook = await this.notebookService.getNotebookById(id);

    if (!notebook) {
      throw new NotFoundException(`Notebook with ID ${id} not found`);
    }

    if (notebook.user._id.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to view this notebook');
    }

    return {
      ...notebook,
      _id: notebook._id.toString(),
      user: {
        ...notebook.user,
        _id: notebook.user._id.toString(),
      },
    };
  }
  

  @Mutation(() => NotebookType)
  async createNotebook(
    @Args('createNotebookInput') createNotebookInput: CreateNotebookInput,
    @Context() context: MyContext,
  ) {
    // Logga il contesto completo
    console.log('Context:', context);
  
    if (!context.user) {
      throw new UnauthorizedException('User is not in context');
    }
  
    const userId = context.user.sub;
  
    if (!userId) {
      throw new UnauthorizedException('User ID (sub) is not defined');
    }
  
    return this.notebookService.createNotebook(createNotebookInput, userId);
  }
  
  @Mutation(() => NotebookType)
  async updateNotebook(
    @Args('id') id: string,
    @Args('updateNotebookInput') updateNotebookInput: UpdateNotebookInput,
    @Context() context: MyContext,
  ) {
    const userId = context.user?.sub;
  
    if (!userId) {
      throw new UnauthorizedException('User is not authenticated');
    }
  
    // Assicurati che l'ID sia incluso nell'input
    updateNotebookInput.id = id;
  
    return this.notebookService.updateNotebook(updateNotebookInput, userId);
  }
  


  @Mutation(() => Boolean)
  async deleteNotebook(@Args('id') id: string, @Context() context: MyContext) {
    const userId = context.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User is not authenticated');
    }

    await this.notebookService.deleteNotebook(id, userId);
    return true;
  }

}
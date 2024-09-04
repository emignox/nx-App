import { Resolver, Query, Mutation, Args, Context,  } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { CreateUserInput } from './dto.user/user.create.input';
import { UpdateUserInput } from './dto.user/user.update.input';
import { loginUserInput } from './dto.user/user.login.input';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

interface MyContext {
  user?: {
    sub: string;
    email: string;
    iat: number;
    exp: number;
  };
}

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserType)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserType> {
    const user = await this.userService.createUser(createUserInput);
    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  @Mutation(() => String)
  async loginUser(@Args('loginUserInput') loginUserInput: loginUserInput): Promise<string> {
    const { accessToken } = await this.userService.loginUser(loginUserInput);
    return accessToken;
  }

  @Mutation(() => Boolean)
  async changeUserPassword(
    @Args('id') id: string,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    await this.userService.changeUserPassword(id, currentPassword, newPassword);
    return true;
  }

  @Mutation(() => UserType)
  async updateUserInfo(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context: MyContext,
  ): Promise<UserType> {
    const userId = context.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (userId !== updateUserInput.id) {
      throw new UnauthorizedException('You are not authorized to update this user data');
    }

    const user = await this.userService.updateUserInfo(updateUserInput.id, updateUserInput.name, updateUserInput.email);
    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string, @Context() context: MyContext): Promise<boolean> {
    const userId = context.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (userId !== id) {
      throw new UnauthorizedException('You are not authorized to delete this user');
    }

    await this.userService.deleteUser(id);
    return true;
  }

  @Query(() => UserType)
  async getUserById(
    @Context() context: MyContext // Recupera il contesto
  ): Promise<UserType> {
    // Estrai l'ID utente dal token JWT che si trova nel contesto
    const userId = context.user?.sub;
  
    if (!userId) {
      throw new UnauthorizedException('Utente non autenticato');
    }
  
    // Ora, usa l'ID utente per recuperare le informazioni dell'utente
    const user = await this.userService.getUserById(userId); // Qui usi `userId`, non quello passato via argomenti
    return {
      ...user,
      _id: user._id.toString(),
    };
  }
  
}

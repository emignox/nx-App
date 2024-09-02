import { Controller,Post,Get,Delete,Put,Param,Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto.user/user.create.input';
import { UpdateUserInput } from './dto.user/user.update.input';
import { User } from './user.entity';
import { ObjectId } from '@mikro-orm/mongodb';
import { loginUserInput } from './dto.user/user.login.input';
import {ChangePasswordInput} from './dto.user/user.update.password'
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

@Get(':id')
async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
}

@Put('password/:id')
async updateUserPassword(
  @Param('id') id: string, 
  @Body() changePasswordInput: ChangePasswordInput
): Promise<void> {
    return await this.userService.changeUserPassword(id, changePasswordInput.currentPassword, changePasswordInput.newPassword);
}


@Put(':id')
async updateUser(@Param('id') id: string, @Body() updateUserInput: UpdateUserInput): Promise<User> {
    return await this.userService.updateUserInfo(id, updateUserInput.name, updateUserInput.email);
}

@Delete(':id')
async deleteUser(@Param('id') id: string): Promise<void> {
    return  await this.userService.deleteUser(id);
}

@Post('/login')
async login(@Body() loginUserInput: loginUserInput): Promise<{ accessToken: string }> {
    return  await this.userService.loginUser(loginUserInput);
}

@Post('/create')
async createUser(@Body() createUserInput: CreateUserInput): Promise<User> {
    return await this.userService.createUser(createUserInput);
}

}


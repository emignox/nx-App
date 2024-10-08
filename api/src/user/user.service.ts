import { Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import {User} from './user.entity';
import * as jwt from 'jsonwebtoken';
import { MikroORM,EntityManager } from '@mikro-orm/mongodb';
import bcrypt from 'bcrypt';
import { CreateUserInput } from './dto.user/user.create.input';
import { UpdateUserInput } from './dto.user/user.update.input';
import { ObjectId } from '@mikro-orm/mongodb';
import { loginUserInput } from './dto.user/user.login.input';

@Injectable()
export class UserService {
    constructor(private readonly orm: MikroORM){}

    private get em(): EntityManager{
        return this.orm.em.fork(); // Crea un nuovo EntityManager per il contesto specifico
    }




    async createUser(createUserInput: CreateUserInput): Promise<User> {
        const em = this.em;
        const { name, email, password } = createUserInput;
    
        // Verifica che la password non sia undefined o null
        if (!password) {
          throw new Error('Password is required');
        }
    
        const existingUser = await em.findOne(User, { email });
        if (existingUser) {
          throw new NotFoundException('User already exists');
        }
    
        try {
          // Assicurati che bcrypt stia ricevendo la password corretta
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User();
          user.name = name;
          user.email = email;
          user.password = hashedPassword;
          
          await em.persistAndFlush(user);
          return user;
        } catch (error) {
          console.error('Error hashing password:', error);
          throw new Error('Error creating user');
        }
      }
    
    async loginUser(loginUserInput: loginUserInput): Promise<{ accessToken: string }> {
        const { email, password } = loginUserInput;
        const user = await this.em.findOne(User, { email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id, email: user.email };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        console.log('Generated access token:', accessToken);

        return { accessToken };
    }

    // async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    //     const em = this.em;
    //     const { id, name, email, password,newPassword } = updateUserInput;
    //     const user = await em.findOne(User, { _id: new ObjectId(id) });
    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${id} not found`);
    //     }
    //     if(name) user.name = name
    //     if (email) user.email = email;
    //     if (password) {
    //         const isMatch = await bcrypt.compare(password, user.password);
    //         if (!isMatch) {
    //             throw new UnauthorizedException('Incorrect password');
    //         }
    //         if (newPassword) {
    //             user.password = await bcrypt.hash(newPassword, 10);
    //         }
    //     }
    //     await em.flush()
    //     return user;
    // }

    async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
        const em = this.em;
        const user = await em.findOne(User, { _id: new ObjectId(id) });
    
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    
        // Verifica che la password corrente sia corretta
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password');
        }
    
        // Hash e aggiorna la nuova password
        user.password = await bcrypt.hash(newPassword, 10);
        await em.flush();
    }
    
    async updateUserInfo(id: string, name?: string, email?: string): Promise<User> {
        const em = this.em;
        const user = await em.findOne(User, { _id: new ObjectId(id) });
    
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    
        if (name) user.name = name;
        if (email) user.email = email;
    
        await em.flush();
        return user;
    }
    

    async deleteUser(id: string): Promise<void> {
        const em = this.em;
        const user = await em.findOne(User, { _id: new ObjectId(id) });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await em.removeAndFlush(user);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.em.findOne(User, { _id: new ObjectId(id) });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}

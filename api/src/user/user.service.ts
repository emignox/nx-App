import { Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import {User} from './user.entity';
import { MikroORM,EntityManager } from '@mikro-orm/mongodb';
import bcrypt from 'bcrypt';
import { CreateUserInput } from './dto.user/user.create.input';
import { UpdateUserInput } from './dto.user/user.update.input';
import { ObjectId } from '@mikro-orm/mongodb';

@Injectable()
export class UserService {
    constructor(private readonly orm: MikroORM){}

    private get em(): EntityManager{
        return this.orm.em.fork(); // Crea un nuovo EntityManager per il contesto specifico
    }


    async createUser(createUserInput: CreateUserInput): Promise<User> {
        const em = this.em
        const { name, email, password } = createUserInput;
        const existingUser = await em.findOne(User, { email });
        if (existingUser) {
            throw new NotFoundException('User already exists');
        }
        try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.name = name
        user.email =email
        user.password=hashedPassword
        await em.persistAndFlush(user);
        return user;
        }catch(error){
            console.error(error)
            throw new Error('Error creating user')
        }
    }
    async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
        const em = this.em;
        const { id, name, email, password,newPassword } = updateUserInput;
        const user = await em.findOne(User, { _id: new ObjectId(id) });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        if(name) user.name = name
        if (email) user.email = email;
        const isMatch =  await bcrypt.compare(password, user.password);
        if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new UnauthorizedException('Incorrect password');
            }
            // Se viene fornita una nuova password, aggiornare l'hash
            if (newPassword) {
                user.password = await bcrypt.hash(newPassword, 10);
            }
        }
        await em.flush()
        return user;
    }

}

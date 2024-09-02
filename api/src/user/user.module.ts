import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService], // Esporta UserService per essere utilizzato in altri moduli
})
export class UserModule {}

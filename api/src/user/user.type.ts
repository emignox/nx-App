import { Field, ObjectType, ID } from '@nestjs/graphql';
import { NotebookType } from '../notebook/notebook.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  _id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => [NotebookType], { nullable: true })
  notebooks?: NotebookType[];
}

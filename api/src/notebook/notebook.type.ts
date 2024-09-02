import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserType } from "../user/user.type"

@ObjectType()
export class NotebookType {
  @Field(() => ID)
  _id!: string;

  @Field()
  title!: string;

  @Field({nullable:true}) // Rendi content opzionale
  content?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(()=> UserType)
  user!: UserType;
}
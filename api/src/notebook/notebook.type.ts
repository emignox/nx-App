import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class NotebookType {
  @Field(() => ID)
  _id!: string;

  @Field()
  title!: string;

  @Field()
  content!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
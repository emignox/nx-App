import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateNotebookInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}
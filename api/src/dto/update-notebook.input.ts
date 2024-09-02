import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateNotebookInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;


}
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotebookInput {
  @Field()
  title!: string;

  @Field()
  content!: string;
}
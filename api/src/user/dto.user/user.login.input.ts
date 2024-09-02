import { Field,InputType } from "@nestjs/graphql";


@InputType()
export class loginUserInput {
    @Field()
    email: string

    @Field()
    password: string
}
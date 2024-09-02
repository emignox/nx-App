import {InputType,Field} from '@nestjs/graphql';


@InputType()
export class UpdateUserInput {
    @Field()
    id!: string

    @Field({nullable: true})
    name?: string

    @Field({nullable: true})
    email?: string

}
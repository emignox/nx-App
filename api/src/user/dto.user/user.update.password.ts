import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
    @Field()
    id: string;

    @Field()
    currentPassword: string;

    @Field()
    newPassword: string;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class SignInResponse {
  @Field()
  user: User;

  @Field({ nullable: true })
  token: string;
}

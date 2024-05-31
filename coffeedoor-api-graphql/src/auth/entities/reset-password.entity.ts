import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class ResetPassword {
  @Field()
  id: string;

  @Field({ nullable: true })
  token: string;

  @Field({ nullable: true })
  expiredAt: Date;

  @Field({ nullable: true })
  isUsed: Date;

  @Field(() => User)
  user: User;
}

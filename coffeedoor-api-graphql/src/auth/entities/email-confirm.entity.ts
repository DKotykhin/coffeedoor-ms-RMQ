import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class EmailConfirm {
  @Field()
  id: string;

  @Field({ nullable: true })
  token: string;

  @Field({ nullable: true })
  expiredAt: Date;

  @Field({ nullable: true })
  verifiedAt: Date;

  @Field(() => User)
  user: User;
}

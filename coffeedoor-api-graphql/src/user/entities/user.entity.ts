import { Field, ObjectType } from '@nestjs/graphql';

import { RoleTypes } from '../../common/types/enums';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  userName: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ defaultValue: false })
  isVerified: boolean;

  @Field(() => RoleTypes)
  role: RoleTypes | string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

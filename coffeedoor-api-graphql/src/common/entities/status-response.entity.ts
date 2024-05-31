import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatusResponse {
  @Field()
  status: boolean;

  @Field({ nullable: true })
  message: string;
}

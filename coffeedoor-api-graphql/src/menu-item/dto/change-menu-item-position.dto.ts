import { IsPositive, IsUUID } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChangeMenuItemPositionDto {
  @Field()
  @IsUUID()
  id: string;

  @Field(() => Int)
  @IsPositive()
  oldPosition: number;

  @Field(() => Int)
  @IsPositive()
  newPosition: number;
}

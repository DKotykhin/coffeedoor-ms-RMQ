import { PartialType } from '@nestjs/mapped-types';
import { IsPositive, IsUUID } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

import { CreateMenuItemDto } from './create-menu-item.dto';

@InputType()
export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @Field()
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  price: string;

  @Field({ nullable: true })
  hidden: boolean;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  position: number;
}

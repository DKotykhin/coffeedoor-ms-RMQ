import { IsPositive, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType, Int } from '@nestjs/graphql';

import { CreateMenuCategoryDto } from './create-menu-category.dto';

@InputType()
export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {
  @Field()
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  hidden: boolean;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  position: number;
}

import {
  IsDefined,
  IsNotEmptyObject,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

import { LanguageCode } from '../../common/types/enums';

@InputType()
class MenuCategoryId {
  @Field()
  @IsUUID()
  id: string;
}
@InputType()
export class CreateMenuItemDto {
  @Field(() => LanguageCode)
  language: LanguageCode;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  price: string;

  @Field({ nullable: true, defaultValue: false })
  hidden: boolean;

  @Field(() => Int, { defaultValue: 0 })
  @IsPositive()
  position: number;

  @Field(() => MenuCategoryId)
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MenuCategoryId)
  menuCategory: MenuCategoryId;
}

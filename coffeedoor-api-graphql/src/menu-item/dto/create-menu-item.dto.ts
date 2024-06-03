import {
  IsDefined,
  IsNotEmptyObject,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

import { IdDto, LanguageCode } from '../../common/_index';

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

  @Field(() => IdDto)
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => IdDto)
  menuCategory: IdDto;
}

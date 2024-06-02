import { Field, InputType, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

import { LanguageCode } from '../../common/types/enums';

@InputType()
export class CreateMenuCategoryDto {
  @Field(() => LanguageCode)
  language: LanguageCode;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true, defaultValue: false })
  hidden: boolean;

  @Field(() => Int, { defaultValue: 0 })
  @IsPositive()
  position: number;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { LanguageCode } from '../types/enums';

@InputType()
export class LanguageDto {
  @Field()
  @IsEnum(LanguageCode)
  language: LanguageCode;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LanguageCode } from '../../common/types/enums';

@ObjectType()
export class MenuCategory {
  @Field()
  id: string;

  @Field(() => LanguageCode)
  language: LanguageCode | string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ defaultValue: false })
  hidden: boolean;

  @Field(() => Int)
  position: number;
}

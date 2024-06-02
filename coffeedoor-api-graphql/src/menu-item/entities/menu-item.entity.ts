import { Field, ObjectType } from '@nestjs/graphql';
import { LanguageCode } from '../../common/types/enums';

@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field(() => LanguageCode)
  language: LanguageCode | string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  price: string;

  @Field({ defaultValue: false })
  hidden: boolean;

  @Field()
  position: number;
}

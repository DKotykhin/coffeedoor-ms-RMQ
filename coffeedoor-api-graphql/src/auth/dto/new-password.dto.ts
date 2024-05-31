import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewPasswordDto {
  @Field()
  @IsString()
  @Length(8, 100, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}

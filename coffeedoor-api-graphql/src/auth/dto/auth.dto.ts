import { IsString, IsEmail, Length, Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PasswordDto {
  @Field()
  @IsString()
  @Length(8, 100, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password: string;
}
@InputType()
export class EmailDto {
  @Field()
  @IsEmail()
  email: string;
}
@InputType()
export class SignInDto extends PasswordDto {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class SignUpDto extends SignInDto {
  @Field()
  @IsString()
  @Length(2, 30, { message: 'Name must be at least 2 characters' })
  userName: string;
}

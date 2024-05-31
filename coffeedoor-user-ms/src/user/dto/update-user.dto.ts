export class UpdateUserDto {
  id: string;
  userName?: string;
  passwordHash?: string;
  address?: string;
  phoneNumber?: string;
  avatar?: string;
  isVerified?: boolean;
  role?: string;
}

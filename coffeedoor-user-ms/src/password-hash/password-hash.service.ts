import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordHashService {
  private readonly index = 5;

  async create(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.index);
    const passwordHash = await bcrypt.hash(password, salt);
    if (!passwordHash) {
      throw new HttpException(
        "Can't create password hash",
        HttpStatus.FORBIDDEN,
      );
    }
    return passwordHash;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (!isValidPass) {
      throw new HttpException('Password not match', HttpStatus.BAD_REQUEST);
    }
    return isValidPass;
  }

  async same(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (isValidPass) {
      throw new HttpException('The same password!', HttpStatus.BAD_REQUEST);
    }
    return isValidPass;
  }
}

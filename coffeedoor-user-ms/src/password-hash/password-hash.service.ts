import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordHashService {
  private readonly index = 5;

  async create(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.index);
    const passwordHash = await bcrypt.hash(password, salt);
    if (!passwordHash) {
      throw new RpcException({
        message: "Can't create password hash",
        status: HttpStatus.FORBIDDEN,
      });
    }
    return passwordHash;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (!isValidPass) {
      throw new RpcException({
        message: 'Password not match',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return isValidPass;
  }

  async same(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (isValidPass) {
      throw new RpcException({
        message: 'The same password!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return isValidPass;
  }
}

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { EntityManager, Repository } from 'typeorm';

import { PasswordHashService } from '../password-hash/password-hash.service';
import { RoleTypes } from '../database/db.enums';

import { User } from './entities/user.entity';
import { StatusResponseDto } from './dto/status-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly passwordHashService: PasswordHashService,
  ) {}
  protected readonly logger = new Logger(UserService.name);

  async getUserByEmailWithRelations(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['emailConfirm', 'resetPassword'],
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async create(createUser: Partial<User>): Promise<User> {
    try {
      return await this.entityManager.save(User, createUser);
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userRepository.preload({
        ...updateUserDto,
        role: updateUserDto.role as RoleTypes,
      });
      if (!updatedUser) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async remove(id: string): Promise<StatusResponseDto> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        });
      }
      return {
        status: true,
        message: `User id ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async confirmPassword({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<StatusResponseDto> {
    if (!password) {
      throw new RpcException({
        message: 'Password is required',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    await this.passwordHashService.compare(password, user.passwordHash);
    return {
      status: true,
      message: 'Password confirmed',
    };
  }

  async changePassword({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<StatusResponseDto> {
    if (!password) {
      throw new RpcException({
        message: 'Password is required',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    try {
      await this.passwordHashService.same(password, user.passwordHash);
      const passwordHash = await this.passwordHashService.create(password);
      user.passwordHash = passwordHash;
      await this.entityManager.save(User, user);
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}

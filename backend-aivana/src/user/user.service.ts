import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToClass } from 'class-transformer';
import { MinioService } from 'src/minio/minio.service';
import { MINIO_FOLDERS } from 'src/constants/minio-folders.constant';
import type { UploadedFileType } from '../product/interfaces/uploaded-file.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly minioService: MinioService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['sellerProfile'] });
  }

  async findUserByName(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['sellerProfile'], 
    });
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sellerProfile'],
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['sellerProfile'],
    });
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['sellerProfile'], 
    });

    return user;
  }

  async update(
    userId: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    await this.userRepository.update(userId, updateUserDto);
    const updatedUser = await this.findUserById(userId);
    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }
    return updatedUser;
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
    avatarFile?: UploadedFileType,
  ): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (avatarFile) {
      const timestamp = Date.now();
      const folderPath = MINIO_FOLDERS.USERS.AVATARS(userId);
      const fileName = `${folderPath}/${timestamp}-${avatarFile.originalname}`;

      await this.minioService.uploadFile(avatarFile, fileName);
      const avatarUrl = this.minioService.getFileUrl(fileName);

      updateData.avatarUrl = avatarUrl;
    }

    Object.assign(user, updateData);

    const updatedUser = await this.userRepository.save(user);

    return plainToClass(ResponseUserDto, updatedUser);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { CreateOmiseDto } from './dto/create-omise.dto';
import { UpdateOmiseDto } from './dto/update-omise.dto';
import { OmiseEntity } from './entities/omise.entity';
import { Injectable } from '@nestjs/common';
import Omise from 'omise';

@Injectable()
export class OmiseService {
  private omise;
  constructor() {
    this.omise = Omise({
      secretKey: process.env.OMISE_SECRET_KEY,
    });
  }

  createChargeWithSource(sourceId: string, amount: number) {
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // +2 นาที
    return this.omise.charges.create({
      amount: amount,
      currency: 'THB',
      source: sourceId,
      // 2minutes
      expires_at: expiresAt,
    });
  }
}

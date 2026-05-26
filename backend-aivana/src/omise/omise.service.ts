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

  createChargeWithSource(sourceId:string, amount: number){
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // +2 นาที
    return this.omise.charges.create({
      amount: amount,
      currency: 'thb',
      source: sourceId,
      expires_at: expiresAt,
    });
  }

  createChargeWithToken(token:string, amount: number){
    return this.omise.charges.create({
      amount: amount,
      currency: 'thb',
      card: token,
    })

  }
} 

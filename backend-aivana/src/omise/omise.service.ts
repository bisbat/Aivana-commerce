
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOmiseDto } from './dto/create-omise.dto';
import { UpdateOmiseDto } from './dto/update-omise.dto';
import { OmiseEntity } from './entities/omise.entity';
import { Injectable } from '@nestjs/common';
import Omise from 'omise';


@Injectable()
export class OmiseService {
  private omise;
  constructor(
  ){
    this.omise=Omise({
      secretKey: process.env.OMISE_SECRET_KEY,
    })
  }

  createChargeWithSource(sourceId:string, amount: number){
    return this.omise.charges.create({
      amount: amount,
      currency: 'THB',
      source: sourceId
    })
  }
} 

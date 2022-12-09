import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAccount, ClientAccountDocument } from '../shcema/сlientAccount.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientAccount.name) private clientAccountModel: Model<ClientAccountDocument>) { }

}

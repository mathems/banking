import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type ClientAccountDocument = HydratedDocument<ClientAccount>;

@Schema()
export class ClientAccount {
  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  name: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  surname: string;

  @Prop({
    unique: true,
    min: 1000,
    max: 100000,
    type: SchemaTypes.Number,
  })
  accountNumber: number;

  @Prop({
    unique: true,
    min: 1000,
    max: 100000,
    type: SchemaTypes.Number,
  })
  recipientAccountNumber: number;

  @Prop({
    default: {
      min: 500,
      max: 100.000,
      type: SchemaTypes.Number,
    }
  })
  balance: number

  @Prop({
    default: {
      min: 500,
      max: 100.000,
      type: SchemaTypes.Number,
    }
  })
  amountToTransfer: number

  @Prop({
    default: null,
    type: SchemaTypes.Date
  })
  lastWithdrawAt: Date

  @Prop({
    default: null,
    type: SchemaTypes.Date
  })
  lastDepositAt: Date

  @Prop({
    default: null,
    type: SchemaTypes.Date
  })
  lastTransferAt: Date

  @Prop({
    default: null,
    type: Number
  })
  counterForDeposit: number
  @Prop({
    default: null,
    type: Number
  })
  counterForWithdraw: number
  @Prop({
    default: null,
    type: Number
  })
  counterForTransfer: number
}

export const ClientAccountSchema = SchemaFactory.createForClass(ClientAccount);

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
    type: SchemaTypes.Number,
  })
  accountNumber: number;

  @Prop({
    type: SchemaTypes.Number,
  })
  recipientAccountNumber: number;

  @Prop({
    default: 0,
    type: SchemaTypes.Number,
  })
  balance: number

  @Prop({
    default: 0,
    type: SchemaTypes.Number,
  })
  amountToTransfer: number

  @Prop({
    expires: 60 * 60 * 24 * 1000,
    type: SchemaTypes.Date
  })
  lastWithdrawAt: Date

  @Prop({
    expires: 60 * 60 * 24 * 1000,
    type: SchemaTypes.Date
  })
  lastDepositAt: Date

  @Prop({
    expires: 60 * 60 * 24 * 1000,
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

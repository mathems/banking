import { IsNotEmpty } from "class-validator";

export class TransferDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  recipientAccountNumber: number;
  @IsNotEmpty()
  balance: number;
  @IsNotEmpty()
  lastTransferAt: Date;
  @IsNotEmpty()
  counterForTransfer: number
}

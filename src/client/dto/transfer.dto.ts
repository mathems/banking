import { IsNotEmpty } from "class-validator";

export class TransferDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  recipientAccountNumber: number;
  @IsNotEmpty()
  amountToTransfer: number;
}

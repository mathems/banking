import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ClientAccountDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  accountNumber: number;
  @IsOptional()
  balance: number
  @IsOptional()
  lastWithdrawAt: Date
  @IsOptional()
  lastDepositAt: Date
  @IsOptional()
  lastTransferAt: Date
}

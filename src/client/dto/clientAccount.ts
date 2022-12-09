import { IsNotEmpty } from "class-validator";

export class ClientAccountDto {
  @IsNotEmpty()
  name: string;
  surname: string;
  accountNumber: number;
  balance: number
  lastWithdrawAt: Date
  lastDepositAt: Date
  lastTransferAt: Date
}

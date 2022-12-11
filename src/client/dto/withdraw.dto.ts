import { IsNotEmpty } from "class-validator";

export class WithdrawDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  amount: number;
}

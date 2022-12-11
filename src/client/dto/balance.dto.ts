import { IsNotEmpty } from "class-validator";

export class BalanceDto {
  @IsNotEmpty()
  accountNumber: number;
  balance: number;
  counter: number;
}

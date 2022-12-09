import { IsNotEmpty } from "class-validator";

export class BalanceDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  balance: number;
  @IsNotEmpty()
  counter: number;
}

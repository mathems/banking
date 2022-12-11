import { IsNotEmpty } from "class-validator";

export class DepositDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty() // create validation for amount
  amount: number;
}

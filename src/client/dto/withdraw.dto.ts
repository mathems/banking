import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { MATH_RANDOM, MAX_TRANSFER, MIN_ACCOUNNUMBER, MIN_TRANSFER } from "../bankConnsts/bank.const";

export class WithdrawDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_ACCOUNNUMBER)
  @Max(MATH_RANDOM)
  accountNumber: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_TRANSFER)
  @Max(MAX_TRANSFER)
  amount: number;
}

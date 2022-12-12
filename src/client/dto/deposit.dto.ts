import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { MATH_RANDOM, MAX_DEPOSIT, MIN_ACCOUNNUMBER, MIN_DEPOSIT } from "../bankConnsts/bank.const";

export class DepositDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_ACCOUNNUMBER)
  @Max(MATH_RANDOM)
  accountNumber: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_DEPOSIT)
  @Max(MAX_DEPOSIT)
  amount: number;
}

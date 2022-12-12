import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { MATH_RANDOM, MIN_ACCOUNNUMBER } from "../bankConnsts/bank.const";

export class BalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_ACCOUNNUMBER)
  @Max(MATH_RANDOM)
  accountNumber: number;
}

import { IsNotEmpty } from "class-validator";

export class DepositDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  balance: number;
}

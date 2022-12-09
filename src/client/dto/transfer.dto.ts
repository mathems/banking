import { IsNotEmpty } from "class-validator";

export class transferDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  recipientAccountNumber: number;
  @IsNotEmpty()
  amount: number;
}

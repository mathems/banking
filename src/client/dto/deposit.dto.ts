import { IsNotEmpty } from "class-validator";

export class depositDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  amount: number;
}

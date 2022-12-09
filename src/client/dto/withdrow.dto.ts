import { IsNotEmpty } from "class-validator";

export class withdrawDto {
  @IsNotEmpty()
  accountNumber: number;
  @IsNotEmpty()
  amount: number;
}

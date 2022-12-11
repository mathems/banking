import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ClientAccountDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
}

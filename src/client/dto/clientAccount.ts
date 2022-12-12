import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ClientAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  surname: string;
}

import { IsNotEmpty, IsOptional } from "class-validator";

export class ClientAccountDto {
  constructor(accountNumber: number) {
    this._accountNumber = accountNumber;
  }
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsOptional()
  _accountNumber: number;
  @IsOptional()
  balance: number
  @IsOptional()
  lastWithdrawAt: Date
  @IsOptional()
  lastDepositAt: Date
  @IsOptional()
  lastTransferAt: Date

  get accountNumber() {
    return this._accountNumber;
  }
  set accountNumber(accountNumber: number) {

    this._accountNumber = accountNumber;
  }
  generateAccountNumber() {
    this._accountNumber + 1
  }
}

import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAccount, ClientAccountDocument } from '../shcema/сlientAccount.schema';
import { ClientAccountDto } from '../dto/clientAccount';
import { BalanceDto } from '../dto/balance.dto';
import { DepositDto } from '../dto/deposit.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientAccount.name) private clientAccountModel: Model<ClientAccountDocument>) { }

  async createAccount(clientAccountDto: ClientAccountDto) {
    const client = await this.clientAccountModel.create({
      name: clientAccountDto.name,
      surname: clientAccountDto.surname,
      accountNumber: clientAccountDto.accountNumber,
      balance: clientAccountDto.balance
    });
    return await client.save()
  };

  async showAccountNumber(clientAccountDto: ClientAccountDto): Promise<number> {
    const createdAccountNumber = clientAccountDto.accountNumber
    return await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
  };

  async showCurrentBalance(balanceDto: BalanceDto): Promise<number> {
    const createdAccountNumber = balanceDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
    return await this.clientAccountModel.findOne({ balance: currentClient.balance });
  };

  async depositOnAccount(depositDto: DepositDto): Promise<number> {
    const createdAccountNumber = depositDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
    const updatedBalance = currentClient.balance + depositDto.amount;
    currentClient.updateOne({ balance: updatedBalance })
    const transaction = await currentClient.updateOne({ lastDepositAt: new Date() }) // TODO implement counter 3 times per 24 hours.
    if (transaction) {
      await currentClient.updateOne({ counter: +1 });
    }
    if (transaction >= 3) {
      throw new RequestTimeoutException();
    }
    return await updatedBalance
  };

  async withdrawFromAccount(): Promise<number> {
    return await
    };
  я
  async limitOfTransactionsForLastDayIsExceeded(userId: number): Promise<boolean> {


    return await
      };


}

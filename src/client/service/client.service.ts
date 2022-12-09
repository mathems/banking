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


  async validateClientsTime(counter: number, firstTransactionTime: Date): Promise<boolean> {

    const limitTransaction = new Date(new Date(firstTransactionTime).getTime() + 60 * 60 * 24 * 1000);
    if (counter >= 3 && limitTransaction.toISOString() > new Date().toISOString()) {
      return false
    }
    if (counter >= 3 && limitTransaction.toISOString() < new Date().toISOString()) {
      return true
    }
  }

  async depositOnAccount(depositDto: DepositDto): Promise<number> {
    const createdAccountNumber = depositDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
    const updatedBalance = currentClient.balance + depositDto.amount;
    if (await currentClient.lastDepositAt === null) {
      await currentClient.updateOne({ lastDepositAt: new Date() })
    }
    const firstTransactionTime = await currentClient.lastDepositAt;

    const maxTransactions = await currentClient.counter

    if (!this.validateClientsTime(maxTransactions, firstTransactionTime)) {
      throw new RequestTimeoutException();
    }
    if (this.validateClientsTime(maxTransactions, firstTransactionTime) && (updatedBalance >= 500 && updatedBalance <= 50.000)) {
      await currentClient.updateOne({ lastDepositAt: new Date() })
      await currentClient.updateOne({ balance: updatedBalance })
      await currentClient.updateOne({ counter: +1 })
    }
    return await currentClient.balance
  };

  async withdrawFromAccount(): Promise<number> {
    return await
    }

  async limitOfTransactionsForLastDayIsExceeded(userId: number): Promise<boolean> {


    return await
      }

}

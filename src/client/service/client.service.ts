import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAccount, ClientAccountDocument } from '../shcemas/сlientAccount.schema';
import { ClientAccountDto } from '../dto/clientAccount';
import { BalanceDto } from '../dto/balance.dto';
import { DepositDto } from '../dto/deposit.dto';
import { WithdrawDto } from '../dto/withdrow.dto';
import { TransferDto } from '../dto/transfer.dto';
var rn = require('random-number');

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientAccount.name) private clientAccountModel: Model<ClientAccountDocument>) { }

  async createAccount(clientAccountDto: ClientAccountDto): Promise<number> {
    const options = {
      min: 1000
      , max: 100000
      , integer: true
    }
    const defaultValue = clientAccountDto.accountNumber = rn(options);
    const client = await this.clientAccountModel.create({
      name: clientAccountDto.name,
      surname: clientAccountDto.surname,
      accountNumber: defaultValue,
      balance: clientAccountDto.balance
    });
    await client.save();
    const currentUser = client._id;
    const createdAcountNamber = await this.clientAccountModel.findOne({ id: currentUser });
    return await createdAcountNamber.accountNumber
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
    const identifyAccountNumber = depositDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: identifyAccountNumber });
    const updatedBalance = currentClient.balance + depositDto.balance;
    if (await currentClient.lastDepositAt === null) {
      await currentClient.updateOne({ lastDepositAt: new Date() })
    }
    const firstTransactionTime = await currentClient.lastDepositAt;

    const maxTransactions = await currentClient.counterForDeposit;

    if (!this.validateClientsTime(maxTransactions, firstTransactionTime)) {
      throw new RequestTimeoutException();
    }
    if (this.validateClientsTime(maxTransactions, firstTransactionTime) && (updatedBalance >= 500 && updatedBalance <= 50.000)) {
      await currentClient.updateOne({ lastDepositAt: new Date() })
      await currentClient.updateOne({ counterForDeposit: +1 })
      await currentClient.updateOne({ balance: updatedBalance })
    }
    return await currentClient.balance
  };

  async withdrawFromAccount(withdrawDto: WithdrawDto): Promise<number> {
    const identifyAccountNumber = withdrawDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: identifyAccountNumber });
    const updatedBalance = currentClient.balance - withdrawDto.amount;
    if (await currentClient.lastWithdrawAt === null) {
      await currentClient.updateOne({ lastWithdrawAt: new Date() })
    }
    const firstTransactionTime = await currentClient.lastWithdrawAt;

    const maxTransactions = await currentClient.counterForWithdraw;
    if (!this.validateClientsTime(maxTransactions, firstTransactionTime)) {
      throw new RequestTimeoutException();
    }
    if (this.validateClientsTime(maxTransactions, firstTransactionTime) && (updatedBalance >= 1000 && updatedBalance <= 25.000)) {
      await currentClient.updateOne({ lastWithdrawAt: new Date() })
      await currentClient.updateOne({ counterForWithdraw: +1 })
      await currentClient.updateOne({ balance: updatedBalance })
    }
    return await currentClient.balance

  };

  async transferToClient(transferDto: TransferDto): Promise<boolean> {
    const identifyCurrentAccountNumber = transferDto.accountNumber
    const identifyRecipientAccountNumber = transferDto.recipientAccountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: identifyCurrentAccountNumber });
    const recipientClient = await this.clientAccountModel.findOne({ accountNumber: identifyRecipientAccountNumber });

    const updatedBalance = currentClient.amountToTransfer + recipientClient.balance;
    if (await currentClient.lastTransferAt === null) {
      await currentClient.updateOne({ lastTransferAt: new Date() })
    }
    const firstTransactionTime = await currentClient.lastTransferAt;

    const maxTransactions = await currentClient.counterForTransfer;
    if (!this.validateClientsTime(maxTransactions, firstTransactionTime)) {
      throw new RequestTimeoutException();
    }
    if (this.validateClientsTime(maxTransactions, firstTransactionTime) && (updatedBalance >= 1000 && updatedBalance <= 25.000)) {
      await currentClient.updateOne({ lastTransferAt: new Date() })
      await currentClient.updateOne({ counterForTransfer: +1 })
      await recipientClient.updateOne({ balance: updatedBalance })
      return true
    }
    return await false
  }
}

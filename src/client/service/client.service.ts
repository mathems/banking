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
    const client = await this.clientAccountModel.create({
      name: clientAccountDto.name,
      surname: clientAccountDto.surname,
      accountNumber: rn(options),
      balance: clientAccountDto.balance
    });
    await client.save();
    return await client.accountNumber
  };

  async showCurrentBalance(balanceDto: BalanceDto): Promise<number> {
    const createdAccountNumber = balanceDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
    const currentBalance = await this.clientAccountModel.findOne({ balance: currentClient.balance });
    return await currentBalance.balance
  }


  async isTimeTransactionValid(counter: number, firstTransactionTime: Date): Promise<boolean> {

    const limitTransaction = new Date(new Date(firstTransactionTime).getTime() + 60 * 60 * 24 * 1000);
    if (counter >= 3 && limitTransaction.toISOString() > new Date().toISOString()) {
      return false
    }
    if (counter >= 3 && limitTransaction.toISOString() < new Date().toISOString()) {
      return true
    }
  }

  async validateDepositBalance(balance: number): Promise<boolean> {
    if (balance >= 500 && balance <= 50.000) {
      return true
    }
    if (balance < 500 || balance > 50.000) {
      return false
    }
  }

  async depositOnAccount(depositDto: DepositDto): Promise<number> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: depositDto.accountNumber });
    const newBalance = currentClient.balance + depositDto.balance;

    if (this.isTimeTransactionValid(currentClient.counterForDeposit, currentClient.lastDepositAt) && this.validateDepositBalance(currentClient.balance)) {
      const updatedBalance = await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { balance: newBalance } }, { new: true });
      await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { counterForDeposit: +1 } }, { new: true });
      await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { lastDepositAt: new Date() } }, { new: true });
      return await updatedBalance.balance
    }
  };

  // async withdrawFromAccount(withdrawDto: WithdrawDto): Promise<number> {
  //   const identifyAccountNumber = withdrawDto.accountNumber
  //   const currentClient = await this.clientAccountModel.findOne({ accountNumber: identifyAccountNumber });
  //   const updatedBalance = currentClient.balance - withdrawDto.amount;
  //   if (await currentClient.lastWithdrawAt === null) {
  //     await currentClient.updateOne({ lastWithdrawAt: new Date() })
  //   }
  //   const firstTransactionTime = await currentClient.lastWithdrawAt;

  //   const maxTransactions = await currentClient.counterForWithdraw;
  //   if (!this.isDepositValid(maxTransactions, firstTransactionTime)) {
  //     throw new RequestTimeoutException();
  //   }
  //   if (this.isDepositValid(maxTransactions, firstTransactionTime) && (updatedBalance >= 1000 && updatedBalance <= 25.000)) {
  //     await currentClient.updateOne({ lastWithdrawAt: new Date() })
  //     await currentClient.updateOne({ counterForWithdraw: +1 })
  //     await currentClient.updateOne({ balance: updatedBalance })
  //   }
  //   return await currentClient.balance

  // };

  // async transferToClient(transferDto: TransferDto): Promise<boolean> {
  //   const identifyCurrentAccountNumber = transferDto.accountNumber
  //   const identifyRecipientAccountNumber = transferDto.recipientAccountNumber
  //   const currentClient = await this.clientAccountModel.findOne({ accountNumber: identifyCurrentAccountNumber });
  //   const recipientClient = await this.clientAccountModel.findOne({ accountNumber: identifyRecipientAccountNumber });

  //   const updatedBalance = currentClient.amountToTransfer + recipientClient.balance;
  //   if (await currentClient.lastTransferAt === null) {
  //     await currentClient.updateOne({ lastTransferAt: new Date() })
  //   }
  //   const firstTransactionTime = await currentClient.lastTransferAt;

  //   const maxTransactions = await currentClient.counterForTransfer;
  //   if (!this.isDepositValid(maxTransactions, firstTransactionTime)) {
  //     throw new RequestTimeoutException();
  //   }
  //   if (this.isDepositValid(maxTransactions, firstTransactionTime) && (updatedBalance >= 1000 && updatedBalance <= 25.000)) {
  //     await currentClient.updateOne({ lastTransferAt: new Date() })
  //     await currentClient.updateOne({ counterForTransfer: +1 })
  //     await recipientClient.updateOne({ balance: updatedBalance })
  //     return true
  //   }
  //   return await false
  // }
}

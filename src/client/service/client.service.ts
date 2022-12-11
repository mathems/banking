import { BadRequestException, Injectable, NotAcceptableException, RequestTimeoutException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAccount, ClientAccountDocument } from '../shcemas/сlientAccount.schema';
import { ClientAccountDto } from '../dto/clientAccount';
import { BalanceDto } from '../dto/balance.dto';
import { DepositDto } from '../dto/deposit.dto';
import { WithdrawDto } from '../dto/withdraw.dto';
import { TransferDto } from '../dto/transfer.dto';
var rn = require('random-number');

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientAccount.name) private clientAccountModel: Model<ClientAccountDocument>) { }

  async createAccount(clientAccountDto: ClientAccountDto): Promise<ClientAccountDocument> {
    const options = {
      min: 1000
      , max: 100000
      , integer: true
    }
    return await await this.clientAccountModel.create({
      name: clientAccountDto.name,
      surname: clientAccountDto.surname,
      accountNumber: rn(options),
    });
  };

  async showCurrentBalance(balanceDto: BalanceDto): Promise<number> {
    const createdAccountNumber = balanceDto.accountNumber
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: createdAccountNumber });
    const currentBalance = await this.clientAccountModel.findOne({ balance: currentClient.balance });
    return await currentBalance.balance
  }



  async depositOnAccount(depositDto: DepositDto): Promise<number | string> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: depositDto.accountNumber });
    const newBalance = currentClient.balance + depositDto.amount;

    if (!(depositDto.amount >= 500 && depositDto.amount <= 50000)) {
      throw new NotAcceptableException()
    }
    if (!(newBalance >= 0 && newBalance <= 100000)) {
      throw new NotAcceptableException()
    }
    if (!(currentClient.counterForDeposit <= 2)) {
      throw new RequestTimeoutException()
    }
    await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForDeposit: 1 } }, { new: true }).exec();
    const updatedBalance = await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { balance: newBalance } }, { new: true });
    return await updatedBalance.balance
  }

  async withdrawFromAccount(withdrawDto: WithdrawDto): Promise<number | string> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: withdrawDto.accountNumber });
    const newBalance = currentClient.balance - withdrawDto.amount;

    if (!(withdrawDto.amount >= 1000 && withdrawDto.amount <= 25000)) {
      throw new NotAcceptableException()
    }
    if (!(newBalance >= 0 && newBalance <= 100000)) {
      throw new NotAcceptableException()
    }
    if (!(currentClient.counterForWithdraw <= 2)) {
      throw new RequestTimeoutException()
    }
    await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForWithdraw: 1 } }, { new: true }).exec();
    const updatedBalance = await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { balance: newBalance } }, { new: true });
    return await updatedBalance.balance
  }


  async transferToClient(transferDto: TransferDto): Promise<boolean> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: transferDto.accountNumber });
    const recipientClient = await this.clientAccountModel.findOne({ accountNumber: transferDto.recipientAccountNumber });

    const newBalance = transferDto.amountToTransfer + recipientClient.balance;
    const postBalance = currentClient.balance - transferDto.amountToTransfer;


    if (!(transferDto.amountToTransfer >= 1000 && transferDto.amountToTransfer <= 25000)) {
      throw new NotAcceptableException()
    }
    if (!(newBalance >= 0 && newBalance <= 100000)) {
      throw new NotAcceptableException()
    }
    if (!(currentClient.counterForTransfer <= 2)) {
      throw new RequestTimeoutException()
    }
    await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForTransfer: 1 } }, { new: true }).exec();
    await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $set: { balance: postBalance } }, { new: true });
    await this.clientAccountModel.findOneAndUpdate({ _id: recipientClient._id }, { $set: { balance: newBalance } }, { new: true });
    return true
  }
};

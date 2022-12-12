import { BadRequestException, Injectable, NotAcceptableException, RequestTimeoutException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAccount, ClientAccountDocument } from '../shcemas/сlientAccount.schema';
import { ClientAccountDto } from '../dto/clientAccount';
import { BalanceDto } from '../dto/balance.dto';
import { DepositDto } from '../dto/deposit.dto';
import { WithdrawDto } from '../dto/withdraw.dto';
import { TransferDto } from '../dto/transfer.dto';
import { MATH_RANDOM, MAX_BALANCE, MAX_DEPOSIT, MAX_TRANSACTION, MAX_TRANSFER, MAX_WITHDRAW, MIN_BALANCE, MIN_DEPOSIT, MIN_TRANSFER, MIN_WITHDRAW } from '../bankConnsts/bank.const';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientAccount.name) private clientAccountModel: Model<ClientAccountDocument>) { }

  async createAccount(clientAccountDto: ClientAccountDto): Promise<ClientAccountDocument> {
    return await this.clientAccountModel.create({
      name: clientAccountDto.name,
      surname: clientAccountDto.surname,
      accountNumber: Math.floor(Math.random() * MATH_RANDOM),
    });
  };

  async showCurrentBalance(balanceDto: BalanceDto): Promise<ClientAccountDocument> {
    return await this.clientAccountModel.findOne({ accountNumber: balanceDto.accountNumber });
  }



  async depositOnAccount(depositDto: DepositDto): Promise<ClientAccountDocument> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: depositDto.accountNumber });
    const newBalance = currentClient.balance + depositDto.amount;
    if (!(newBalance >= MIN_BALANCE && newBalance <= MAX_BALANCE)) {
      throw new BadRequestException()
    }
    if (!(currentClient.counterForDeposit <= MAX_TRANSACTION)) {
      throw new BadRequestException()
    }
    return await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForDeposit: 1 }, $set: { balance: newBalance } }, { new: true });
  }

  async withdrawFromAccount(withdrawDto: WithdrawDto): Promise<ClientAccountDocument> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: withdrawDto.accountNumber });
    const newBalance = currentClient.balance - withdrawDto.amount;

    if (!(newBalance >= MIN_BALANCE && newBalance <= MAX_BALANCE)) {
      throw new BadRequestException()
    }
    if (!(currentClient.counterForWithdraw <= MAX_TRANSACTION)) {
      throw new BadRequestException()
    }
    return await this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForWithdraw: 1 }, $set: { balance: newBalance } }, { new: true }).exec();
  }


  async transferToClient(transferDto: TransferDto): Promise<ClientAccountDocument> {
    const currentClient = await this.clientAccountModel.findOne({ accountNumber: transferDto.accountNumber });
    const recipientClient = await this.clientAccountModel.findOne({ accountNumber: transferDto.recipientAccountNumber });

    const newBalance = transferDto.amountToTransfer + recipientClient.balance;
    const postBalance = currentClient.balance - transferDto.amountToTransfer;
    
    if (!(newBalance >= MIN_BALANCE && newBalance <= MAX_BALANCE)) {
      throw new BadRequestException()
    }
    if (!(currentClient.counterForTransfer <= MAX_TRANSACTION)) {
      throw new BadRequestException()
    }
    Promise.all(
      [this.clientAccountModel.findOneAndUpdate({ _id: currentClient._id }, { $inc: { counterForTransfer: 1 }, $set: { balance: postBalance } }, { new: true }),
      this.clientAccountModel.findOneAndUpdate({ _id: recipientClient._id }, { $set: { balance: newBalance } }, { new: true })])
    return currentClient
  }
};

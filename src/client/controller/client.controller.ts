import { BadRequestException, Body, Controller, NotAcceptableException, Post, Put, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { BalanceDto } from '../dto/balance.dto';
import { ClientAccountDto } from '../dto/clientAccount';
import { DepositDto } from '../dto/deposit.dto';
import { TransferDto } from '../dto/transfer.dto';
import { WithdrawDto } from '../dto/withdraw.dto';
import { ClientService } from '../service/client.service';

@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
  ) { }

  @Post('/create')
  async createNewClient(@Body() clientAccountDto: ClientAccountDto): Promise<string> {
    if (!clientAccountDto.name || !clientAccountDto.surname) {
      throw BadRequestException
    }
    const accountNumber = await this.clientService.createAccount(clientAccountDto)
    return `Your new Bank Account Number is: ${accountNumber.accountNumber}`
  }

  @Post('/balance')
  async balance(@Body() balanceDto: BalanceDto): Promise<string> {
    if (!balanceDto.accountNumber) {
      throw UnauthorizedException
    }
    const currentBalance = await this.clientService.showCurrentBalance(balanceDto)
    return `Your current balance is: ${currentBalance}`
  }


  @Put('/deposit')
  async deposit(@Body() depositDto: DepositDto): Promise<string> {
    if (!depositDto.accountNumber) {
      throw new UnauthorizedException();
    }
    if (!depositDto.amount) {
      throw new NotAcceptableException();
    }
    const postBalance = await this.clientService.depositOnAccount(depositDto)
    return `Your balance post deposit: ${postBalance}`
  }

  @Put('/withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto): Promise<string> {
    if (!withdrawDto.accountNumber) {
      throw new UnauthorizedException();
    }
    if (!withdrawDto.amount) {
      throw new NotAcceptableException();
    }
    const postBalance = await this.clientService.withdrawFromAccount(withdrawDto);
    return `Your balance post withdrawal: ${postBalance}`
  }

  @Put('/transfer')
  async transfer(@Body() transferDto: TransferDto): Promise<string> {
    if (!transferDto.accountNumber || !transferDto.recipientAccountNumber) {
      throw new UnauthorizedException();
    }
    if (!transferDto.amountToTransfer) {
      throw new NotAcceptableException();
    }
    if (await this.clientService.transferToClient(transferDto)) {
      return `Funds in the amount ${transferDto.amountToTransfer}$ successfully delivered to ${transferDto.recipientAccountNumber} Bank Account`
    }
    throw new BadRequestException();
  }
}
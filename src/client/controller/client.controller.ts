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
  async createNewClient(@Body() clientAccountDto: ClientAccountDto): Promise<any> {
    const accountNumber = await this.clientService.createAccount(clientAccountDto)
    return {
      message: `Your new Bank Account Number is: ${accountNumber.accountNumber}`,
      accountNumber: accountNumber.accountNumber
    }
  }

  @Post('/balance')
  async balance(@Body() balanceDto: BalanceDto): Promise<any> {
    const currentBalance = await this.clientService.showCurrentBalance(balanceDto)
    return {
      message: `Your current balance is: ${currentBalance.balance}`,
      balance: currentBalance.balance
    }
  }


  @Post('/deposit')
  async deposit(@Body() depositDto: DepositDto): Promise<string> {
    const postBalance = await this.clientService.depositOnAccount(depositDto)
    return `Your balance post deposit: ${postBalance}`
  }

  @Post('/withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto): Promise<string> {
    const postBalance = await this.clientService.withdrawFromAccount(withdrawDto);
    return `Your balance post withdrawal: ${postBalance}`
  }

  @Post('/transfer')
  async transfer(@Body() transferDto: TransferDto): Promise<string> {
    if (await this.clientService.transferToClient(transferDto)) {
      return `Funds in the amount ${transferDto.amountToTransfer}$ successfully delivered to ${transferDto.recipientAccountNumber} Bank Account`
    }
    throw new BadRequestException();
  }
}
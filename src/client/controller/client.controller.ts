import { BadRequestException, Body, Controller, Get, NotAcceptableException, Post, Put, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { BalanceDto } from '../dto/balance.dto';
import { CreateAccountDto } from '../dto/createAccount.dto';
import { depositDto as DepositDto } from '../dto/deposit.dto';
import { withdrawDto as WithdrawDto } from '../dto/withdrow.dto';
import { ClientService } from '../service/client.service';

@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
  ) { }

  @Post('/create')
  async createNewClient(@Body() createAccountDto: CreateAccountDto) {
    if (!createAccountDto) {
      throw BadRequestException
    }
    await this.clientService.createAccount(createAccountDto)

    return this.clientService.showAccountNumber(createAccountDto)
  }

  @Post('/balance')
  async balance(@Body() balanceDto: BalanceDto) {
    if (!balanceDto) {
      throw UnauthorizedException
    }
    return this.clientService.showAccountBalance(createAccountDto)
  }

  @Put()
  async deposit(@Body() depositDto: DepositDto) {
    if (!depositDto.accountNumber) {
      throw UnauthorizedException
    }
    if (!depositDto.amount) {
      throw NotAcceptableException
    }
    return this.clientService.depositOnAccount(createAccountDto)
  }

  @Put()
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    if (!withdrawDto.accountNumber) {
      throw UnauthorizedException
    }
    if (!withdrawDto.amount) {
      throw NotAcceptableException
    }
    if (await this.clientService.limitOfTransactionsForLastDayIsExceeded(withdrawDto.accountNumber)) {
      throw RequestTimeoutException
    }
    return await this.clientService.depositOnAccount(createAccountDto);
  }


}
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { ClientService } from '../../client/service/client.service';
import { ClientController } from '../../client/controller/client.controller';
import { plainToInstance } from 'class-transformer';
import { ClientAccountDto } from '../../client/dto/clientAccount';
import { clientAccountDtoMock } from './mock/clientAccount.dto.mock';
import { BalanceDto } from '../../client/dto/balance.dto';
import { balanceDtoMock } from './mock/balance.dto.mock';
import { DepositDto } from '../../client/dto/deposit.dto';
import { depositDtoMock } from './mock/deposit.dto.mock';
import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import { MAX_BALANCE, MIN_BALANCE, MIN_DEPOSIT, MIN_WITHDRAW } from '../../client/bankConnsts/bank.const';
import { WithdrawDto } from '../../client/dto/withdraw.dto';
import { withdrawDtoMock } from './mock/withdraw.dto.mock';
import { TransferDto } from '../../client/dto/transfer.dto';
import { transferDtoMock } from './mock/transfer.dto.mock';




function mockModel() {
  const mock = jest.fn((data) => ({
    update: jest.fn((input) => input),
    save: jest.fn(() => ({
      ...data,
      toObject: jest.fn(() => data)
    })),
    toObject: jest.fn(() => data)
  })) as any
  mock.find = jest.fn()
  mock.findById = jest.fn()
  mock.findOne = jest.fn()
  mock.save = jest.fn()
  mock.findOneAndUpdate = jest.fn()
  mock.paginate = jest.fn()
  mock.delete = jest.fn()
  mock.create = jest.fn()
  return mock
}

describe('ClientService', () => {
  let service: ClientService
  let clientAccountModel = mockModel()


  beforeEach(async () => {
    clientAccountModel = mockModel()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('ClientAccount'),
          useFactory: () => {
            return clientAccountModel
          }
        },
        ClientService],
      controllers: [ClientController],
      imports: []
    }).compile()
    service = module.get<ClientService>(ClientService)
  })



  it('ClientService - should be defined', () => {
    expect(service).toBeDefined()
  })

  it('createAccount() - should call .create()', async () => {
    const depositDto = plainToInstance(ClientAccountDto, clientAccountDtoMock);
    await service.createAccount(depositDto)
    expect(clientAccountModel.create).toHaveBeenCalledTimes(1);
  })

  it('showCurrentBalance() - should call .findOne()', async () => {
    const balanceDto = plainToInstance(BalanceDto, balanceDtoMock);
    await service.showCurrentBalance(balanceDto)
    expect(clientAccountModel.findOne).toHaveBeenCalledTimes(1);
  })

  it('depositOnAccount() - should throw BadRequestException if unacceptable amount', async () => {
    const depositDto = plainToInstance(DepositDto, depositDtoMock);
    clientAccountModel.findOne = jest.fn(() => ({ balance: MIN_DEPOSIT }))
    try {
      await service.depositOnAccount(depositDto)
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })

  it('depositOnAccount() - should should call .findOneAndUpdate()', async () => {
    const depositDto = plainToInstance(DepositDto, depositDtoMock);
    clientAccountModel.findOne = jest.fn(() => ({ balance: MIN_DEPOSIT, counterForDeposit: 1 }))
    await service.depositOnAccount(depositDto)
    expect(clientAccountModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
  })

  it('withdrawFromAccount() - should throw BadRequestException if unacceptable transaction', async () => {
    const withdrawDto = plainToInstance(WithdrawDto, withdrawDtoMock);
    clientAccountModel.findOne = jest.fn(() => ({ balance: MIN_WITHDRAW, counterForWithdraw: 4 }))
    try {
      await service.withdrawFromAccount(withdrawDto)
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })

  it('withdrawFromAccount() - should call .findOneAndUpdate()', async () => {
    const withdrawDto = plainToInstance(WithdrawDto, withdrawDtoMock);
    clientAccountModel.findOne = jest.fn(() => ({ balance: MIN_WITHDRAW, counterForDeposit: 1 }))
    await service.depositOnAccount(withdrawDto)
    expect(clientAccountModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
  })

  it('transferToClient() - should call .findOneAndUpdate()', async () => {
    const transferDto = plainToInstance(TransferDto, transferDtoMock);
    clientAccountModel.findOne = jest.fn(() => ({ balance: MIN_WITHDRAW, counterForWithdraw: 4 }))
    try {
      await service.transferToClient(transferDto)
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })

})
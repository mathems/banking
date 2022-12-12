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
import { NotAcceptableException } from '@nestjs/common';




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
  // mock.findOne = jest.fn(() => ({ balance: 200000 }))
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

  it.only('depositOnAccount() - should throw NotAcceptableException if unacceptable amount', async () => {
    const depositDto = plainToInstance(DepositDto, depositDtoMock);
    // clientAccountModel.findOneAndUpdate = jest.fn(async (depositDto): Promise<any> => {
    //   return null
    // })
    // clientAccountModel.findOne = jest.fn(() => ({ balance: 200000 }))
    try {
      await service.depositOnAccount(depositDto)
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(NotAcceptableException)
    }
    // .rejects.toBeInstanceOf(NotAcceptableException)
  })

  // it('depositOnAccount() - should throw NotAcceptableException if unacceptable balance', async () => {
  //   const depositDto = plainToInstance(DepositDto, depositDtoMock);
  //   await service.showCurrentBalance(depositDto)
  //   expect(clientAccountModel.findOne).toHaveBeenCalledTimes(1);
  // })
})
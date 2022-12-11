import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { ClientService } from '../../client/service/client.service';
import { ClientController } from '../../client/controller/client.controller';
import { plainToInstance } from 'class-transformer';
import { ClientAccountDto } from '../../client/dto/clientAccount';
import { clientAccountDtoMock } from './mock/clientAccount.dto.mock';




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

  it('createAccount() - should accept ', async () => {
    const depositDto = plainToInstance(ClientAccountDto, clientAccountDtoMock);
    const action = await service.createAccount(depositDto)
    expect(s).toHaveBeenCalledWith({"",""})
  })
})
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './controller/client.controller';
import { ClientService } from './service/client.service';
import { ClientAccount, ClientAccountSchema } from './shcema/сlientAccount.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClientAccount.name, schema: ClientAccountSchema }])],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule { }
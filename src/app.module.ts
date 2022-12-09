import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';



@Module({
  imports: [MongooseModule.forRoot('mongodb://root:password@127.0.0.1:27017'), ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

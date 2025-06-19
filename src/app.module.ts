import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { Product } from './entities/product.entity'
import { OrderModule } from './modules/order/order.module';
import { getDBConfig } from './configs/appconfig'
import { VendorModule } from './modules/vendor/vendor.module';
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule'
dotenv.config();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDBConfig()),
    OrderModule,
    VendorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

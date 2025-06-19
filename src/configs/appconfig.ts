import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity'
import { Product } from 'src/entities/product.entity'
import { VendorProduct } from 'src/entities/vendorproduct.entity';

export function getDBConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.URL,
    entities: [Product, Order,VendorProduct],
    // synchronize: true,
  };
}
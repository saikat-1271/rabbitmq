import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as fs from 'fs'
import * as path from 'path'
import { Order } from 'src/entities/order.entity'
import { Product } from 'src/entities/product.entity'

export const TypeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:process.env.URL,
  // host: process.env.PG_HOST,
  // port: parseInt(process.env.PG_PORT || '5432', 10),
  // username: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // database: process.env.PG_DATABASE,
  entities: [Product, Order],
  synchronize: true,
}

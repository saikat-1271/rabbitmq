import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { sendenqueue } from 'src/utils/rabbitmq.service'
import { Order } from 'src/entities/order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderStatus } from 'src/configs/enum.config'
import { Product } from 'src/entities/product.entity'

@Injectable()
export class OrderRepo {
  @InjectRepository(Product)
  private productrepository: Repository<Product>;
  @InjectRepository(Order)
  private ordesrepository: Repository<Order>;
  async insertorder(createOrderDto: CreateOrderDto) {
    try {
      return this.ordesrepository.createQueryBuilder()
        .insert()
        .into('order')
        .values({ productId: createOrderDto.productId, quantity: createOrderDto.quantity, status: OrderStatus.pending })
        .execute();

    } catch (e) {
      console.log('Error while inserting order --> ', JSON.stringify(createOrderDto), e);
      throw e
    }
  }
  async getVendorId(productId: number) {
    try {
      const res = await this.productrepository
        .createQueryBuilder('p')
        .select('p.vendorId')
        .where('p.id = :id', { id: productId })
        .getOne();

      return res?.vendorId || null
    } catch (e) {

      throw e
    }
  }
}

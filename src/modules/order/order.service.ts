import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { sendenqueue } from 'src/utils/rabbitmq.service'
import { OrderRepo } from './order.repository'

@Injectable()
export class OrderService {
  constructor(private readonly orderrepo: OrderRepo) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      console.log('incoming order --> ', JSON.stringify(createOrderDto));
      await this.orderrepo.insertorder(createOrderDto);
      const getvendorId = await this.orderrepo.getVendorId(createOrderDto.productId)
      console.log('Order saved --> ', JSON.stringify(createOrderDto));
      await sendenqueue('orders', { ...createOrderDto, vendorId: getvendorId })
    } catch (e) {
      throw e
    }
  }
}

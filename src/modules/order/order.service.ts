import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { sendenqueue } from 'src/utils/rabbitmq.service'

@Injectable()
export class OrderService {
  async create(createOrderDto: CreateOrderDto) {
    try {
      console.log('here')
      await sendenqueue('orders', createOrderDto)
    } catch (e) {
      throw e
    }
  }
}

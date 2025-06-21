import { HttpException, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { sendenqueue } from 'src/utils/rabbitmq.service'
import { OrderRepo } from './order.repository'
import { InsertResult } from 'typeorm';
import { HttpStatusCode } from 'axios';

@Injectable()
export class OrderService {
  constructor(private readonly orderrepo: OrderRepo) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      console.log('incoming order --> ', JSON.stringify(createOrderDto));
      //insert order in table as pending status
      const productinfo = await this.orderrepo.productexist(createOrderDto.productId)
      if (productinfo) {
        throw new HttpException('Product not found', HttpStatusCode.NotFound)

      }

      const orderobj: InsertResult = await this.orderrepo.insertorder(createOrderDto);
      const orderid = orderobj?.raw[0]?.id || null;
      if (!orderid) {
        throw new HttpException('Unable to fetch orderid', HttpStatusCode.BadRequest)
      }
      const getvendorId = await this.orderrepo.getVendorId(createOrderDto.productId)
      console.log('Order saved --> ', JSON.stringify(createOrderDto));
      // sending vendorid in enqueue body to sync specific vendor befor confirming order
      await sendenqueue('orders', { ...createOrderDto, vendorId: getvendorId, orderid: orderid })

      return {
        status: 'Your order is created'
      }
    } catch (e) {
      throw e
    }
  }
}

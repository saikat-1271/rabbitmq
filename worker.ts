import * as amqplib from 'amqplib'
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.URL,
});
console.log(process.env.URL)

enum OrderStatus {
  pending = 'PENDING',
  success = 'SUCCESS', failed = 'FAILED'
}



async function vendorsync(vendorId: string) {
  try {
    await axios.get(`http://localhost:3000/vendor/${vendorId}/stock`);
  } catch (e) {
    console.error(e)
  }
}
async function EnqueueWorker() {
  let canreenqueue = false;
  try {
    await dataSource.initialize();
    const conn = await amqplib.connect('amqp://localhost')
    const channel = await conn.createChannel()
    await channel.assertQueue('orders', { durable: true })
    channel.consume('orders', async (msg) => {
      if (!msg) return;
      console.log(msg)
      const { productId, quantity, vendorId } = JSON.parse(msg.content.toString());

      try {
        await dataSource.transaction(async (manager) => {
          if (vendorId) {
            await vendorsync(vendorId);
          }

          const product = await manager.createQueryBuilder().select().from('product', 'p').where('p.id = :productid', { productid: productId }).getRawOne();

          if (!product) {
            throw new Error(`Product doesnot exist for productid ${productId}`);
          }

          product.stock -= quantity
          if ((product.stock) <= 0) {
            throw new Error(`Insufficient stock for productid ${productId}`);

          }

          await manager.createQueryBuilder().update('product').set({
            stock: (product.stock)
          }).where('id =:id', { id: productId }).execute()

          await manager.createQueryBuilder()
            .update('order')
            .set({ status: OrderStatus.success })
            .execute();
        })
        channel.ack(msg);
      } catch (err) {
        await dataSource.createQueryBuilder()
          .update('order')
          .set({ status: OrderStatus.failed })
          .execute();
        console.error('Transaction failed, rolled back:', err);
        channel.nack(msg, false, false);
      }
    });
  } catch (e) {
    console.error(e)
  }
}
EnqueueWorker();

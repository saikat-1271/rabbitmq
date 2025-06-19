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
      const { productId, quantity, vendorId, orderid } = JSON.parse(msg.content.toString());
      console.log('Processsing order for ', JSON.stringify({ productId, quantity, vendorId, orderid }))

      try {
        // creating transaction
        await dataSource.transaction(async (manager) => {

          const orderinfo = await manager.createQueryBuilder()
            .select('status')
            .from('order', 'o')
            .where('id = :orderid', { orderid })
            .getRawOne();

            // checking if order is in pending mode, if not skip
          if (!orderinfo || orderinfo.status !== OrderStatus.pending) {
            console.log(`Skipping already processed order ${orderid}`);
            channel.ack(msg);
            return;
          }
          //sync db for the specific vendor of corresponding order
          if (vendorId) {
            await vendorsync(vendorId);
          }

          const product = await manager.createQueryBuilder()
          .select().from('product', 'p')
          .where('p.id = :productid', { productid: productId })
          .getRawOne();

          if (!product) {
            throw new Error(`Product doesnot exist for productid ${productId}`);
          }

          product.stock -= quantity
          if ((product.stock) <= 0) {
            throw new Error(`Insufficient stock for productid ${productId}`);

          }

          // if stock available, update product 
          await manager.createQueryBuilder().update('product').set({
            stock: (product.stock)
          }).where('id =:id', { id: productId }).execute()

          // update order status to success
          await manager.createQueryBuilder()
            .update('order')
            .set({ status: OrderStatus.success })
            .where('id =:orderid', { orderid: orderid })
            .execute();
        })
        channel.ack(msg);
      } catch (err) {
        console.error('Transaction failed, rolled back:', err.message);

        // Retry logic
        const maxretries = 3;
        const retries = msg.properties.headers['retrycount'] || 0;
        console.log('retries count -->', retries)

        if (retries < maxretries) {
          const newheaders = {
            ...msg.properties.headers,
            'retrycount': retries + 1,
          };

          //reenqueue
          channel.sendToQueue(msg.fields.routingKey, msg.content, {
            headers: newheaders,
            persistent: true,
          });

          // mark as failed msg
          channel.ack(msg);
        } else {
          // After max retries, mark order as failed
          await dataSource.createQueryBuilder()
            .update('order')
            .set({ status: OrderStatus.failed })
            .where('id =:orderid', { orderid: orderid })
            .execute();

          channel.nack(msg, false, false); // drop msg permanently
        }
      }
    });
  } catch (e) {
    console.error(e.message)
  }
}
EnqueueWorker();

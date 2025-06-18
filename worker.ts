import * as amqplib from 'amqplib'
async function EnqueueWorker() {
  try {
    const conn = await amqplib.connect('amqp://localhost')
    const channel = await conn.createChannel()
    await channel.assertQueue('orders', { durable: true })
    channel.consume('orders', async (msg) => {
    if (!msg) return;
    console.log(msg)
    const res = JSON.parse(msg.content.toString());
    console.log(res)

    // const queryRunner = dataSource.createQueryRunner();
    // await queryRunner.startTransaction();

    try {
    //   const product = await queryRunner.manager.findOne(Product, {
    //     where: { id: productId },
    //     lock: { mode: 'pessimistic_write' },
    //   });

    //   if (!product || product.stock < quantity) {
    //     throw new Error('Insufficient stock');
    //   }

    //   product.stock -= quantity;
    //   await queryRunner.manager.save(product);

    //   await queryRunner.manager.save(Order, {
    //     productId,
    //     quantity,
    //     status: 'SUCCESS',
    //   });

    //   await queryRunner.commitTransaction();
      channel.ack(msg);
    } catch (err) {
    //   await queryRunner.rollbackTransaction();
    //   await queryRunner.manager.save(Order, {
    //     productId,
    //     quantity,
    //     status: 'FAILED',
    //   });
      channel.nack(msg, false, false); // skip or requeue
    } finally {
    //   await queryRunner.release();
    }
  });
  } catch (e) {}
}
EnqueueWorker();

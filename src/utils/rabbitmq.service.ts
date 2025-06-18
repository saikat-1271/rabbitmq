import * as amqplib from 'amqplib'

export async function sendenqueue(queuename: string, data: object) {
  try {
    const conn = await amqplib.connect('amqp://localhost')
    const channel = await conn.createChannel()
    await channel.assertQueue(queuename, { durable: true })

    channel.sendToQueue(queuename, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    })
    return { status: true, message: 'Order queued' }
  } catch (e) {
    console.warn(JSON.stringify(e))
    throw e
  }
}

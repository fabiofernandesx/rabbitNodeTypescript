import client, { Connection, Channel, ConsumeMessage, Replies } from 'amqplib'

const connect = async (
  url = 'amqp://user:pass@localhost'
): Promise<Connection> => {
  return await client.connect(url)
}
const createChannel = async (conn: Connection): Promise<Channel> => {
  return await conn.createChannel()
}

const channelAssertQueue = async (
  channel: Channel,
  queueName: string
): Promise<Replies.AssertQueue> => {
  return await channel.assertQueue(queueName)
}

const sendToQueue = (channel: Channel, queueName: string, buffer: Buffer) => {
  channel.sendToQueue(queueName, buffer)
}

const consume = (channel: Channel, queue: string) => {
  channel.consume(queue, (msg: ConsumeMessage | null) => {
    if (msg) {
      console.log(`reading the message: ${msg.content.toString()}`)
      channel.ack(msg)
    }
  })
}

const connection = async (queueName = 'defaultQueue') => {
  const conn = await connect()
  const channel = await createChannel(conn)
  const assertedChannelToQueue = await channelAssertQueue(channel, queueName)

  // Produce
  sendToQueue(channel, queueName, Buffer.from('something here as payload --- '))

  //Consume
  consume(channel, queueName)
}

connection()

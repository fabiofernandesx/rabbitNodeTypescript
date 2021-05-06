var amqp = require('amqplib')

const connect = (url = 'amqp://localhost') => {
  return new Promise((resolve, reject) => {
    amqp
      .connect(url)
      .then(conn => resolve(conn))
      .catch(err => reject(err))
  })
}

const createChannel = conn => {
  return new Promise((resolve, reject) => {
    conn
      .createChannel()
      .then(channel => resolve(channel))
      .catch(err => reject(err))
  })
}

const channelAssertQueue = (channel, queueName) => {
  return new Promise((resolve, reject) => {
    channel
      .assertQueue(queueName)
      .then(asserted => resolve(channel))
      .catch(err => reject(err))
  })
}

const sendToQueue = (channel, queueName, buffer) => {
  channel.sendToQueue(queueName, buffer)
}

const consume = (channel, queue) => {
  channel.consume(queue, msg => {
    console.log(`reading the message: ${msg.content.toString()}`)
    channel.ack(msg)
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

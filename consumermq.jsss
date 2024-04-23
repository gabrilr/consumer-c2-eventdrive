
const amqp = require('amqplib');

async function consumeMessages() {
  // Conecta al servidor RabbitMQ
  const connection = await amqp.connect('amqp://guest:guest@50.16.171.248/');
  const channel = await connection.createChannel();

  const exchangeName = 'amq.topic';  //exchange
  const queueName = 'mqttarq';  //cola
  const routerpath = 'esp32.mqtt'

  // Asegúrate de que el intercambio exista
  await channel.assertExchange(exchangeName, 'topic', { durable: true });

  // Asegúrate de que la cola exista y está vinculada al intercambio
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName, routerpath);
  
  console.log('Consumidor iniciado.');

  // Configura la función de retorno de llamada para manejar los mensajes entrantes
  channel.consume(queueName, async (msg) => {
    const messageContent = msg.content.toString();

    if (messageContent !== null ) {
      
      console.log(`Data: ${messageContent}`);
      
      try {
        console.log('.');
      } catch (error) {
        console.error('Error al enviar el mensaje a la API:', error.message);
      }

    }
  }, { noAck: true });
    
}

consumeMessages().catch(console.error);

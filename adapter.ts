const amqp = require('amqplib');
const axios = require('axios');

async function recibirEvento() {
    const connection = await amqp.connect('amqp://guest:guest@50.16.171.248');
    const channel = await connection.createChannel();

    const exchange = 'colaGabo'; //nombre del exchange al que apunta

    await channel.assertExchange(exchange, 'direct', { durable: true });

    const queueName = 'colaGabo'; //busca la cola a la que apunta el exchange
    const queue = await channel.assertQueue(queueName, { exclusive: false });
    await channel.bindQueue(queue.queue, exchange, 'gabo');

    console.log('Escuchando eventos de RabbitMQ');

    channel.consume(queue.queue, async(mensaje: { content: any; } | null) => {
        if (mensaje !== null) {
            console.log(`Mensaje recibido de RabbitMQ: ${mensaje.content}`);
            
            // Enviar el mensaje a través de una solicitud POST a una API externa
            const noTarjeta = mensaje.content
            try {
                const noTarjeta = String(mensaje.content)
                const response = await axios.post('http://localhost:3001/transaccion/', {
                    noTarjeta
                });
                console.log("Respuesta de la API externa:",response.data);
            } catch (error) {
                console.error("Error al enviar el mensaje a la API externa:", error);
            }
        }
    }, { noAck: true });
}

recibirEvento().catch(console.error);
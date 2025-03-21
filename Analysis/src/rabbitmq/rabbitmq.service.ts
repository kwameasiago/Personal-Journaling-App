import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly uri: string) {}

  async init(): Promise<void> {
    const maxRetries = 4;        
    const retryDelay = 3000; 
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        this.connection = await amqp.connect(this.uri);
        this.channel = await this.connection.createChannel();
        console.log('Connected to RabbitMQ');
        return;
      } catch (err) {
        attempt++;
        console.error(
          `Attempt ${attempt} - Unable to connect to RabbitMQ: ${err.message}. Retrying in ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error(`Failed to connect to RabbitMQ after ${maxRetries} attempts`);
  }

  async publish(queue: string, message: any): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }

  async subscribe(queue: string, callback: (message: any) => void): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}


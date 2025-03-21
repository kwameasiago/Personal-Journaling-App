import { Module, Global, DynamicModule } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(options: { uri: string }): DynamicModule {
    const rabbitMQServiceProvider = {
      provide: RabbitmqService,
      useFactory: async () => {
        const service = new RabbitmqService(options.uri);
        await service.init();
        return service;
      },
    };

    return {
      module: RabbitMQModule,
      providers: [rabbitMQServiceProvider],
      exports: [RabbitmqService],
    };
  }
}

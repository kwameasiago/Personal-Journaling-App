import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class AnalysisService implements OnModuleInit{
    constructor(
        private rabbitmqService: RabbitmqService
    ){}

    async onModuleInit() {
        await this.rabbitmqService.subscribe('post_journal', (message) => {
            console.log(message)
        })

        await this.rabbitmqService.subscribe('update_journal', (message) => {
            console.log(message)
        })
    }

}

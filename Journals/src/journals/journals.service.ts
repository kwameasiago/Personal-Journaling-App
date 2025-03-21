import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class JournalsService {
    constructor(
        private readonly rabbitmqService: RabbitmqService
    ){}
    
    async postJournal(){
        await this.rabbitmqService.publish('post_journal', {data: 'hi'})
        await this.rabbitmqService.publish('update_journal', {data: 'hi'})
        return {
            msg: 'hello world'
        }
    }
}

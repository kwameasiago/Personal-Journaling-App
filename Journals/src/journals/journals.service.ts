import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository,  } from '@nestjs/typeorm';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { Request } from 'express';
import { Journal } from 'src/entities/journals.entity';
import { Tags } from 'src/entities/tags.entity';

@Injectable()
export class JournalsService {
    constructor(
        @InjectRepository(Journal)
        private readonly journalsRepository: Repository<Journal>,

        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,

        private readonly rabbitmqService: RabbitmqService
    ){}
    /**
     * Creates a new journal entry along with its associated tags and publishes an event.
     *
     * This function runs within a transaction to ensure that both the journal and its tags are saved atomically.
     * It extracts the authenticated user from the request, creates a new Journal entry, saves it, maps the provided tags
     * to include the user's id, saves the tags, and then publishes a 'create_journal' event using the RabbitMQ service.
     *
     * @param {any} journalData - The data for the journal entry, including title, content, and an array of tag objects.
     * @param {Request} req - The HTTP request object containing the authenticated user (attached to req.user).
     * @returns {Promise<any>} A promise that resolves to an object with the status and message of the operation.
     */
    async postJournal(journalData: any, req: Request){
        
        const result = this.journalsRepository.manager.transaction(async manager => {
            const user = (req as any).user;
            const newJournal = manager.create(Journal, {
                title: journalData.title,
                content: journalData.content,
                user_id: user.id
            })
            const savedJournal = await manager.save(newJournal)

            const tags = journalData.tags.map(tag => ({
                ...tag,
                user_id: user.id
            }))

            const newTags =  manager.create(Tags, tags)
            const savedTags = await manager.save(newTags)
            await this.rabbitmqService.publish('create_journal', {Journal: savedJournal, tags: savedTags})
            return {
                status: 'success',
                message: 'Journal saved'

            }
        })
        return result
    }
}

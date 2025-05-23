import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
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
    ) { }
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
    async postJournal(journalData: any, req: Request) {

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
                user_id: user.idk,
                journal: savedJournal
            }))

            const newTags = manager.create(Tags, tags)
            const savedTags = await manager.save(newTags)
            await this.rabbitmqService.publish('create_journal', { Journal: savedJournal, tags: savedTags })
            return {
                status: 'success',
                message: 'Journal saved'

            }
        })
        return result
    }

    /**
     * Updates an existing journal entry with new data.
     *
     * This method first checks if the journal exists in the database. If not found, it throws an HttpException with a 404 status.
     * Otherwise, it updates the journal's title and content using the provided body data.
     *
     * @param {any} body - The update payload containing the new journal title and content.
     * @param {Request} req - The HTTP request object (currently not used in this function).
     * @param {number} journalId - The ID of the journal to update.
     * @returns {Promise<{status: string, message: string}>} A promise that resolves to an object with a success status and message.
     * @throws {HttpException} If the journal with the provided ID does not exist.
     */
    async updateJournal(body: any, req: Request, journalId: number) {
        const user_id = (req as any).user.id;
        const journal = await this.journalsRepository.findOne({ where: { id: journalId } })
        if (journal == null) {
            throw new HttpException(
                'Journal does not exist',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.journalsRepository.update(journalId, {
            title: body.title,
            content: body.content
        });

        const updatedJournal = await this.journalsRepository.findOne({ where: { id: journalId, user_id } });
        await this.rabbitmqService.publish('update_journal', updatedJournal)
        return {
            status: 'success',
            message: 'Journal updated',
        }
    }
    /**
     * Deletes a journal based on the provided journal ID.
     *
     * This method looks up the journal using the journalId. If the journal does not exist,
     * it throws an HttpException with a 404 status. If found, it deletes the journal and returns
     * a success message.
     *
     * @param req - The HTTP request object.
     * @param journalId - The unique identifier of the journal to delete.
     * @returns An object with a status and message confirming the deletion.
     * @throws HttpException if the journal does not exist.
     */
    async deleteJournal(req: Request, journalId: number) {
        const user_id = (req as any).user.id;
        const journal = await this.journalsRepository.findOne({ where: { id: journalId, user_id } })
        if (journal == null) {
            throw new HttpException(
                'Journal does not exist',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.journalsRepository.remove(journal)
        await this.rabbitmqService.publish('delete_journal', journalId)
        return {
            status: 'success',
            message: 'Journal deleted'
        }
    }
    /**
     * Retrieves a single journal by its ID along with its related tags.
     *
     * This method searches for a journal using the provided journalId and fetches its related tags.
     * If the journal is not found, it throws an HttpException with a 404 status code.
     *
     * @param req - The HTTP request object.
     * @param journalId - The unique identifier of the journal to retrieve.
     * @returns An object containing the status and the retrieved journal.
     * @throws HttpException if the journal does not exist.
     */
    async getOneJournal(req: Request, journalId: number) {
        const user_id = (req as any).user.id;
        const journal = await this.journalsRepository.findOne({ where: { id: journalId, user_id  }, relations: ['tags'], })
        if (journal == null) {
            throw new HttpException(
                'Journal does not exist',
                HttpStatus.NOT_FOUND,
            );
        }
        return {
            status: 'success',
            journal
        }
    }

    /**
     * Retrieves a paginated list of journals along with pagination details.
     *
     * This method extracts pagination parameters (page and limit) from the request query,
     * calculates the offset (skip), and then queries the journals repository to fetch journals
     * with their related tags. The results are ordered by creation date in descending order.
     * It returns both the list of journals and a pagination object containing total items,
     * current page, total pages, and items per page.
     *
     * @param req - The HTTP request object containing query parameters for pagination.
     * @param journalId - An unused parameter in this method.
     * @returns An object with the list of journals and pagination details.
     */
    async getJournals(req: Request, journalId: number) {
        const user_id = (req as any).user.id;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (page - 1) * limit;

        const [journals, total] = await this.journalsRepository.findAndCount({
            where:{user_id},
            relations: ['tags'],
            skip,
            take: limit,
            order: { created_at: 'DESC' }
        });
        const totalPages = Math.ceil(total / limit);

        return {
            journals,
            pagination: {
                totalItems: total,
                currentPage: page,
                totalPages,
                itemsPerPage: limit,
            },
        }
    }

}

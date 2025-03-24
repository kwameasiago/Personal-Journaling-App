import { Injectable, OnModuleInit } from '@nestjs/common';
import * as moment from 'moment';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { Journals } from 'src/entities/journal.entity';
import { Tags } from 'src/entities/tags.entity';
import { serviceEvent } from 'src/entities/serviceEvent.entity';
import { WordCount } from 'src/entities/wordCount.entity';

@Injectable()
export class AnalysisService implements OnModuleInit {
    constructor(
        private rabbitmqService: RabbitmqService,
        @InjectRepository(Journals)
        private readonly journalsRepository: Repository<Journals>,

        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,

        @InjectRepository(serviceEvent)
        private readonly serviceEventRepository: Repository<serviceEvent>,

        @InjectRepository(WordCount)
        private readonly wordCountRepository: Repository<WordCount>
    ) { }

    /**
     * Combines duplicate entries in an array of word count objects and sums their values.
     *
     * @param data - An array of objects each containing a 'text' property (word) and a 'value' property (count).
     * @returns An array of objects where each word appears only once with its total count.
     */
    combineAndSum(data: { text: string; value: number }[]): { text: string; value: number }[] {
        const combined = data.reduce((acc, curr) => {
            if (acc[curr.text]) {
                acc[curr.text] += curr.value;
            } else {
                acc[curr.text] = curr.value;
            }
            return acc;
        }, {} as Record<string, number>);
      
        return Object.keys(combined).map(word => ({ text: word, value: combined[word] }));
    }

    /**
     * Returns the word count of a given string.
     *
     * @param text - The input string to count words from.
     * @returns The number of words in the input string.
     */
    getWordCount(text: string): number {
        const words = text.trim().split(/\s+/);
        return text.trim() === '' ? 0 : words.length;
    }

    /**
     * Extracts a time-of-day label from an ISO date string.
     *
     * The function uses Moment.js to parse the provided ISO date string and determine the hour.
     * It then categorizes the hour into a time-of-day label as follows:
     * - "Morning": 5 AM (inclusive) to 12 PM (exclusive)
     * - "Afternoon": 12 PM (inclusive) to 5 PM (exclusive)
     * - "Evening": 5 PM (inclusive) to 9 PM (exclusive)
     * - "Night": 9 PM to 5 AM
     *
     * @param isoString - The ISO date string (e.g., "2025-03-23T23:20:13.346Z").
     * @returns A string representing the time of day ("Morning", "Afternoon", "Evening", or "Night").
     */
    extractTimeOfDay(isoString: string): string {
        const hour = moment(isoString).hour();

        if (hour >= 5 && hour < 12) {
            return "Morning";
        } else if (hour >= 12 && hour < 17) {
            return "Afternoon";
        } else if (hour >= 17 && hour < 21) {
            return "Evening";
        } else {
            return "Night";
        }
    }

    /**
     * Generates a word cloud data array from the input text by counting the frequency of each word,
     * while excluding common stop words.
     *
     * The function:
     * - Converts the input text to lowercase.
     * - Removes punctuation.
     * - Splits the text into words.
     * - Excludes words that are considered stop words (e.g., "the", "and", etc.).
     * - Counts the occurrences of each word.
     * - Returns an array of objects with each object containing the word as 'text' and its frequency as 'value'.
     *
     * @param text - The input string from which to generate the word cloud.
     * @returns An array of objects representing the word cloud.
     */
    generateWordCloud(text: string): { text: string; value: number }[] {
        const stopWords = new Set([
            'I',
            'the',
            'and',
            'a',
            'an',
            'of',
            'in',
            'to',
            'with'
        ]);

        const cleanedText = text.replace(/[^\w\s]/g, '').toLowerCase();

        const wordsArray = cleanedText.split(/\s+/);

        const wordCounts = new Map<string, number>();
        for (const word of wordsArray) {
            if (!word || stopWords.has(word)) {
                continue;
            }
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }

        const wordCloud = Array.from(wordCounts.entries()).map(([word, count]) => ({
            text: word,
            value: count,
        }));

        wordCloud.sort((a, b) => b.value - a.value);

        return wordCloud;
    }

    /**
     * Handles the creation of a journal, along with its service event, tags, and word cloud.
     *
     * @param Journal - The journal data from the message.
     * @param tags - An array of tag objects from the message.
     * @returns An object containing the saved journal.
     */
    async handleCreateJournal(Journal: any, tags: any[]): Promise<{ savedJournal: Journals }> {
        const length = this.getWordCount(Journal.content);
        const wordCloud = this.generateWordCloud(Journal.content);
        const timeOfDay = this.extractTimeOfDay(Journal.created_at);

        const result = await this.serviceEventRepository.manager.transaction(async manager => {
            // Create and save the service event.
            const newServiceEvent = manager.create(serviceEvent, {
                type: 'create_journal'
            });
            const savedServiceEvent = await manager.save(newServiceEvent);

            // Create and save the journal.
            const newJournal = manager.create(Journals, {
                journal_id: Journal.id,
                title: Journal.title,
                content: Journal.content,
                journal_length: length,
                journal_created_at_date: Journal.created_at,
                journal_updated_at_date: Journal.updated_at,
                time_of_day: timeOfDay,
                user_id: Journal.user_id,
                event: savedServiceEvent
            });
            const savedJournal = await manager.save(newJournal);

            // Create and save the tags.
            const newTags = manager.create(Tags, tags.map(tag => ({
                name: tag.name,
                journals: savedJournal,
                event: savedServiceEvent
            })));
            await manager.save(newTags);

            // Create and save the word count.
            const newWordCount = manager.create(WordCount, {
                word_cloud: wordCloud,
                journals: savedJournal,
                event: savedServiceEvent
            });
            await manager.save(newWordCount);

            return { savedJournal };
        });
        return result;
    }

    /**
     * Deletes a journal by its ID.
     *
     * @param journal_id - The unique identifier of the journal to be deleted.
     */
    async deleteJournalByID(journal_id: any): Promise<void> {
        await this.journalsRepository.delete({ journal_id });
    }

    /**
     * Initializes the module by subscribing to RabbitMQ events for creating, updating, and deleting journals.
     */
    async onModuleInit(): Promise<void> {
        await this.rabbitmqService.subscribe('create_journal', async (message) => {
            try {
                const { Journal, tags } = message;
                const result = await this.handleCreateJournal(Journal, tags);
                console.log('event consumed successfully');
            } catch (error) {
                console.log('an error occurred');
            }
        });

        await this.rabbitmqService.subscribe('update_journal', async (message) => {
            const { id, title, content } = message;
            const length: number = this.getWordCount(content);
            const wordCloud: any = this.generateWordCloud(content);
            const journal = await this.journalsRepository.findOne({
                where: { journal_id: id },
                relations: ['wordCount']
            });
            console.log(message);

            if (journal) {
                await this.journalsRepository.update({ id: journal.id }, {
                    title: title,
                    content: content,
                    journal_length: length,
                });
                if (journal.wordCount) {
                    await this.wordCountRepository.update({ id: journal.wordCount.id }, {
                        word_cloud: wordCloud
                    });
                }
            }
        });

        await this.rabbitmqService.subscribe('delete_journal', async (message) => {
            await this.journalsRepository.delete({ journal_id: message });
        });
    }

    /**
     * Retrieves the frequency of journals created per day for a user between given dates.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the frequency result.
     */
    async getJournalFrequency(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const result = await this.journalsRepository
            .createQueryBuilder('journals')
            .select('DATE(journals.journal_created_at_date)', 'day')
            .addSelect('Count(*)', 'count')
            .where('journals.user_id = :userId', { userId: user.id })
            .andWhere('journals.journal_created_at_date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('day')
            .getRawMany();
        return {
            status: 'success',
            result
        };
    }

    /**
     * Retrieves the distribution of journal categories (tags) for a user between given dates.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the category distribution result.
     */
    async getCategoryDistribution(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const result = await this.tagsRepository
            .createQueryBuilder('tags')
            .innerJoin(
                'tags.journals',
                'journals',
                'journals.user_id = :userId AND journals.journal_created_at_date BETWEEN :startDate AND :endDate',
                { userId: user.id, startDate, endDate }
            )
            .select('tags.name', 'tags.id')
            .addSelect('COUNT(tags.id)', 'count')
            .groupBy("tags.name")
            .getRawMany();
        return {
            status: 'success',
            result
        };
    }

    /**
     * Retrieves the total word length of journals per day for a user between given dates.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the total word length result.
     */
    async getWordLength(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const result = await this.journalsRepository
            .createQueryBuilder('journals')
            .select('DATE(journals.journal_created_at_date)', 'day')
            .addSelect('SUM(journals.journal_length)', 'totalLength')
            .where('journals.user_id = :userId', { userId: user.id })
            .andWhere('journals.journal_created_at_date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('day')
            .orderBy('day', 'ASC')
            .getRawMany();

        return {
            status: 'success',
            result
        };
    }

    /**
     * Retrieves the average word length of journals by category for a user between given dates.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the average word length per category result.
     */
    async getWordLengthByCategory(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const result = await this.tagsRepository
            .createQueryBuilder('tags')
            .innerJoin(
                'tags.journals',
                'journals',
                'journals.user_id = :userId and journals.journal_created_at_date BETWEEN :startDate AND :endDate',
                { userId: user.id, startDate, endDate }
            )
            .select('tags.name', 'category')
            .addSelect('AVG(journals.journal_length)', 'averageLength')
            .groupBy('tags.name')
            .getRawMany();

        return {
            status: 'success',
            result
        };
    }

    /**
     * Retrieves the distribution of journals based on the time of day they were created for a user between given dates.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the time-of-day distribution result.
     */
    async getDistributionByTimeOfDay(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const result = await this.journalsRepository
            .createQueryBuilder('journals')
            .select('journals.time_of_day', 'timeOfDay')
            .addSelect('COUNT(journals.id)', 'count')
            .where('journals.user_id = :userId', { userId: user.id })
            .andWhere('journals.journal_created_at_date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .groupBy('journals.time_of_day')
            .orderBy('journals.time_of_day', 'ASC')
            .getRawMany();
        return {
            status: 'success',
            result
        };
    }

    /**
     * Retrieves the aggregated word cloud data for journals for a user between given dates.
     *
     * The function aggregates the word cloud arrays from the word count records, then combines
     * and sums duplicate word counts.
     *
     * @param req - The HTTP request object containing the user.
     * @param startDate - The start date for filtering journals.
     * @param endDate - The end date for filtering journals.
     * @returns An object with a status and the aggregated word cloud result.
     */
    async getWordCloud(req: Request, startDate: string, endDate: string) {
        const user = (req as any).user;
        const data = await this.wordCountRepository
            .createQueryBuilder('wordCount')
            .innerJoin('wordCount.journals', 'journals')
            .where('journals.user_id = :userId', { userId: user.id })
            .andWhere('journals.journal_created_at_date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawMany();

        let combinedWord: { text: string; value: number }[] = [];
        data.forEach((arr) => {
            combinedWord = combinedWord.concat(arr.wordCount_word_cloud);
        });
        let result = this.combineAndSum(combinedWord);
        return {
            status: 'success',
            result,
        };
    }
}

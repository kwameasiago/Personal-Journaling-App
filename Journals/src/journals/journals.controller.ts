import { Controller, Post } from '@nestjs/common';
import { JournalsService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(
        private journalService: JournalsService
    ){}
    @Post('')
    async postJournal(){
        return this.journalService.postJournal()
    }

}

import { Controller, Body,Post,Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth-gaurd';
import { JournalsService } from './journals.service';
import { Request } from 'express';
import { CreateJournalsDto } from './dto/journals.dto';

@Controller('journals')
export class JournalsController {
    constructor(
        private journalService: JournalsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('')
    async postJournal(@Body() createJournalsDto: CreateJournalsDto, @Req() req: Request){
        return this.journalService.postJournal(createJournalsDto, req)
    }

}

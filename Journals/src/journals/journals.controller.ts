import { Controller, Get,Body,Post,Delete, Param,Put,Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth-gaurd';
import { JournalsService } from './journals.service';
import { Request } from 'express';
import { CreateJournalsDto, UpdateJournalDto } from './dto/journals.dto';

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

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateJournal(@Body() updateJournalDto: UpdateJournalDto, @Req() req: Request, @Param('id') journalId: number){
        return this.journalService.updateJournal(updateJournalDto, req, journalId)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteJournal(@Req() req: Request, @Param('id') journalId: number){
        return this.journalService.deleteJournal(req, journalId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getJournals(@Req() req: Request, @Param('id') journalId: number){
        return this.journalService.getJournals(req, journalId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneJournal(@Req() req: Request, @Param('id') journalId: number){
        return this.journalService.getOneJournal(req, journalId)
    }

}

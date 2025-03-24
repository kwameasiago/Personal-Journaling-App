import { Controller, Get, Req, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth-gaurd';
import { AnalysisService } from './analysis.service';
import { Request } from 'express';
import { start } from 'repl';

@Controller('analysis')
export class AnalysisController {
    constructor(
        private AnalysisService: AnalysisService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('journal-frequency')
    async getJournalFrequency(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string){
        try {
            return this.AnalysisService.getJournalFrequency(req, startDate, endDate)
        } catch (error) {
            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('category-distribution')
    async getCategoryDistribution(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ){
        return this.AnalysisService.getCategoryDistribution(req, startDate, endDate)
    }


    @UseGuards(JwtAuthGuard)
    @Get('word-length')
    async getWordLength(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ){
        return this.AnalysisService.getWordLength(req, startDate, endDate)
    }

    @UseGuards(JwtAuthGuard)
    @Get('word-length-by-category')
    async getWordLengthByCategory(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ){
        return this.AnalysisService.getWordLengthByCategory(req, startDate, endDate)
    }

    @UseGuards(JwtAuthGuard)
    @Get('time-of-day-distribution')
    async getDistributionByTimeOfDay(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ){
        
        return this.AnalysisService.getDistributionByTimeOfDay(req, startDate, endDate)
    }

    @UseGuards(JwtAuthGuard)
    @Get('word-cloud')
    async getWordCloud(
        @Req() req: Request,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ){
        return this.AnalysisService.getWordCloud(req, startDate, endDate)
    }
}

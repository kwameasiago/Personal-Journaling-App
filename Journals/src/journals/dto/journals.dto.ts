import { IsString, IsNotEmpty, IsArray} from 'class-validator';

export class JournalsDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    title: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    content: string;

    @IsArray()
    @IsNotEmpty({ message: 'Password is required' })
    tags: string;
  }

export class CreateJournalsDto extends JournalsDto{
    
}

export class UpdateJournalDto extends JournalsDto{

}

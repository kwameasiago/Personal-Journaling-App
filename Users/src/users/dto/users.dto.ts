import { IsString, IsNotEmpty} from 'class-validator';

export class RegisterBodyDto {
    @IsNotEmpty({ message: 'Username is required' })
    readonly username: string

    @IsNotEmpty({ message: 'Username is required' })
    readonly password: string
}
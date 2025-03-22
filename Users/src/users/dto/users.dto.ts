import { IsString, IsNotEmpty} from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    username: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
  }
  
  export class RegisterBodyDto extends AuthCredentialsDto {
    
  }
  
  export class LoginBodyDto extends AuthCredentialsDto {
    
  }
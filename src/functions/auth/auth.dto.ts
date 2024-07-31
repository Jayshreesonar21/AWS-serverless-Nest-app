import { IsEmail, IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

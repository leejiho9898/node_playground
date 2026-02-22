import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: "아이디를 입력해 주세요." })
  username: string;

  @IsString()
  @IsNotEmpty({ message: "비밀번호를 입력해 주세요." })
  @MinLength(1)
  password: string;
}

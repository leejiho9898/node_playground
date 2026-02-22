import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
  @IsString()
  @IsNotEmpty({ message: "refresh_token이 필요합니다." })
  refresh_token: string;
}

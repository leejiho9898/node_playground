import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class LoginService {
  login(dto: LoginDto): { success: boolean } {
    if (dto.id?.trim() === "asd" && dto.password?.trim() === "asd") {
      return { success: true };
    }
    return { success: false };
  }
}

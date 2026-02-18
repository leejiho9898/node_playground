import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginService {
  login(id: string, password: string): { success: boolean } {
    if (id === "asd" && password === "asd") {
      return { success: true };
    }
    return { success: false };
  }
}

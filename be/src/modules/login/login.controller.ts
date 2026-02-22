import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { LoginService } from "./login.service";

@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }

  @Post("signup")
  signup(@Body() dto: SignUpDto) {
    return this.loginService.signup(dto);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LoginService } from "./login.service";

@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    const token =
      typeof dto.refresh_token === "string" ? dto.refresh_token.trim() : "";
    if (!token) throw new UnauthorizedException("refresh_token이 필요합니다.");
    return this.loginService.refresh(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Request() req: { user?: { userId: number; username: string } }) {
    if (!req.user) throw new UnauthorizedException();
    return { id: req.user.userId, username: req.user.username };
  }

  @Post("logout")
  async logout(@Body() dto: RefreshDto) {
    const token =
      typeof dto.refresh_token === "string" ? dto.refresh_token.trim() : "";
    if (token) await this.loginService.logout(token);
    return {};
  }

  @Post("signup")
  signup(@Body() dto: SignUpDto) {
    return this.loginService.signup(dto);
  }
}

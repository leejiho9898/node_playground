import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { IsNull, Repository } from "typeorm";
import { RefreshTokenEntity } from "../../entities/refresh-token.entity";
import { UserEntity } from "../../entities/user.entity";
import { JwtPayload } from "./strategies/jwt.strategy";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/sign-up.dto";

const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;

function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export type LoginSuccess = {
  success: true;
  access_token: string;
  refresh_token: string;
  user: { id: number; username: string };
};

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<{ success: false } | LoginSuccess> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const username = dto.username;
    const passwordRaw = dto.password;
    if (!username || !passwordRaw) return { success: false };
    const user = await this.userRepo.findOne({
      where: { username: username as string },
      select: ["id", "username", "password"],
    });
    if (!user) return { success: false };
    const ok = await bcrypt.compare(passwordRaw, user.password);
    if (!ok) return { success: false };
    const accessPayload: JwtPayload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(accessPayload);
    const refreshSecret =
      this.config.get<string>("JWT_REFRESH_SECRET") ?? "default-refresh-secret";
    const refresh_token = jwt.sign(
      { sub: user.id, type: "refresh" },
      refreshSecret,
      { expiresIn: SEVEN_DAYS_SEC },
    );
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_SEC * 1000);
    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash: hashRefreshToken(refresh_token),
      expiresAt,
    });
    return {
      success: true,
      access_token,
      refresh_token,
      user: { id: user.id, username: user.username },
    };
  }

  async refresh(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const refreshSecret =
      this.config.get<string>("JWT_REFRESH_SECRET") ?? "default-refresh-secret";
    let payload: { sub?: number; type?: string };
    try {
      payload = jwt.verify(refreshToken, refreshSecret) as {
        sub?: number;
        type?: string;
      };
    } catch {
      throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다.");
    }
    if (payload.type !== "refresh" || typeof payload.sub !== "number") {
      throw new UnauthorizedException("리프레시 토큰이 유효하지 않습니다.");
    }
    const tokenHash = hashRefreshToken(refreshToken);
    const now = new Date();
    const row = await this.refreshTokenRepo.findOne({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: IsNull(),
      },
    });
    if (!row || row.expiresAt.getTime() <= now.getTime()) {
      throw new UnauthorizedException(
        "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
      );
    }
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: ["id", "username"],
    });
    if (!user) throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
    row.revokedAt = now;
    await this.refreshTokenRepo.save(row);
    const accessPayload: JwtPayload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(accessPayload);
    const newRefreshToken = jwt.sign(
      { sub: user.id, type: "refresh" },
      refreshSecret,
      { expiresIn: SEVEN_DAYS_SEC },
    );
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_SEC * 1000);
    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash: hashRefreshToken(newRefreshToken),
      expiresAt,
    });
    return { access_token, refresh_token: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    const row = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
    });
    if (row && row.revokedAt === null) {
      row.revokedAt = new Date();
      await this.refreshTokenRepo.save(row);
    }
  }

  async signup(dto: SignUpDto): Promise<{ success: true }> {
    const username = dto.username;
    const passwordRaw = dto.password;
    if (!username || !passwordRaw) {
      throw new BadRequestException("아이디와 비밀번호를 입력해 주세요.");
    }

    const existing = await this.userRepo.findOne({ where: { username } });
    if (existing) {
      throw new ConflictException("이미 사용 중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    await this.userRepo.save({
      username,
      password: hashedPassword,
    });

    return { success: true };
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(dto: LoginDto): Promise<{ success: boolean }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const username = dto.username;
    const passwordRaw = dto.password;
    if (!username || !passwordRaw) return { success: false };
    const user = await this.userRepo.findOne({
      where: { username: username as string },
      select: ["id", "password"],
    });
    if (!user) return { success: false };
    const ok = await bcrypt.compare(passwordRaw, user.password);
    return { success: ok };
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

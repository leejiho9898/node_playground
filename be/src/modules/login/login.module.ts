import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenEntity } from "../../entities/refresh-token.entity";
import { UserEntity } from "../../entities/user.entity";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_SECRET") ?? "default-secret";
        const expiresIn = config.get<string>("JWT_EXPIRES_IN", "7d");
        const expiresInSeconds =
          typeof expiresIn === "string" && expiresIn.endsWith("d")
            ? parseInt(expiresIn, 10) * 24 * 60 * 60
            : 604800;
        return {
          secret,
          signOptions: { expiresIn: expiresInSeconds },
        };
      },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy],
  exports: [LoginService, JwtModule],
})
export class LoginModule {}

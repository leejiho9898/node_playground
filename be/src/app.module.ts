import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import { UserEntity } from "./entities/user.entity";
import { LoginModule } from "./modules/login/login.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST", "localhost"),
        port: parseInt(config.get<string>("DB_PORT") ?? "3306", 10),
        username: config.get<string>("DB_USERNAME", "root"),
        password: config.get<string>("DB_PASSWORD", "root"),
        database: config.get<string>("DB_DATABASE", "test"),
        entities: [UserEntity, RefreshTokenEntity],
        synchronize: true,
      }),
    }),
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

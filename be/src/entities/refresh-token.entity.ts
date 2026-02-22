import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("refresh_tokens")
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({ length: 64 })
  tokenHash: string;

  @Column({ type: "datetime" })
  expiresAt: Date;

  @Column({ type: "datetime", nullable: true })
  revokedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}

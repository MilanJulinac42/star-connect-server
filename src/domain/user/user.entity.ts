import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Talent } from "../talent/talent.entity";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ type: "text", nullable: true })
  biography?: string;

  @Column({ default: false })
  isTalent: boolean;

  @OneToOne(() => Talent, (talent) => talent.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  talent?: Talent;
}

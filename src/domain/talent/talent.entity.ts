import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity("Talent")
export class Talent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.talent)
  @JoinColumn()
  user: User;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerVideo: number;

  @Column({ type: "smallint" })
  turnaroundTime: number;

  @Column({ type: "text", nullable: true })
  categories?: string;
}

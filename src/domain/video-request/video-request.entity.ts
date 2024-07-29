import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity("VideoRequest")
export class VideoRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "talent_id" })
  talent: User;

  @Column({ type: "text" })
  instructions: string;

  @Column()
  recipientName: string;

  @Column()
  occasion: string;

  @Column({
    type: "enum",
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
  })
  status: "pending" | "in_progress" | "completed" | "cancelled";

  @Column({ nullable: true })
  videoFile?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

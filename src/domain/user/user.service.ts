import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { HttpError } from "routing-controllers";
import {
  LoginInput,
  RegisterUserInput,
  UpdateUserInput,
  UserAuthResponse,
} from "./user.types";
import { Session, SessionData } from "express-session";

@Service()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async registerUser(input: RegisterUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: input.email,
    });

    if (existingUser) {
      throw new HttpError(400, "Email is already taken");
    }

    const hashedPassword = await hash(input.password, 10);
    const user = this.userRepository.create({
      ...input,
      passwordHash: hashedPassword,
    });

    await this.userRepository.save(user);
    return user;
  }

  async loginUser(
    input: LoginInput,
    session: Session & Partial<SessionData>
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: input.email });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordMatch = await compare(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    session.userId = user.id;
    await new Promise((resolve, reject) => {
      session.save((err: any) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    return user;
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (input.password) {
      user.passwordHash = await hash(input.password, 10);
      delete input.password;
    }

    Object.assign(user, input);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    await this.userRepository.remove(user);
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new HttpError(404, "User not found!");
    }

    return user;
  }
}

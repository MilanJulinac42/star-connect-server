import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import { User } from "./user.entity";
// import {RegisterInput, LoginInput, UserAuthResponse}
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { HttpError } from "routing-controllers";

interface RegisterUserInput {
  email: string;
  password: string;
  [key: string]: any;
}

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

  async loginUser(input: any): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: input.email });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordMatch = await compare(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1d",
    });

    return { user, token };
  }

  async updateUser(id: number, input: any): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (input.password) {
      input.passwordHash = await hash(input.password, 10);
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

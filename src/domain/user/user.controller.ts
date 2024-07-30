import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UseBefore,
  OnUndefined,
  HttpCode,
} from "routing-controllers";
import { Inject } from "typedi";
import { Response } from "express";
import { User } from "./user.entity";
// import { RegisterInput, LoginInput, UpdateUserInput } from '../types';
import { UserService } from "./user.service";
// import { AuthMiddleware } from '../middleware/AuthMiddleware';

@JsonController("/users")
export class UserController {
  @Inject()
  private userService: UserService;

  @Get("/")
  //   @UseBefore(AuthMiddleware)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get("/:id")
  //   @UseBefore(AuthMiddleware)
  async getUserById(@Param("id") id: number): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Put("/:id")
  //   @UseBefore(AuthMiddleware)
  async updateUser(@Param("id") id: number, @Body() input: any): Promise<User> {
    return this.userService.updateUser(id, input);
  }

  @Delete("/:id")
  //   @UseBefore(AuthMiddleware)
  @OnUndefined(204)
  async deleteUser(@Param("id") id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}

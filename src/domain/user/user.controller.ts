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
import {
  RegisterUserInput,
  LoginInput,
  UpdateUserInput,
  UserAuthResponse,
} from "./user.types";
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
  async getUserById(@Param("id") id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post("/register")
  @HttpCode(201)
  async register(@Body() registerInput: RegisterUserInput): Promise<User> {
    return this.userService.registerUser(registerInput);
  }

  @Post("/login")
  @HttpCode(200)
  async login(
    @Body() loginInput: LoginInput,
    @Res() res: Response
  ): Promise<UserAuthResponse> {
    const userAuthResponse = await this.userService.loginUser(loginInput);
    const { user, token } = userAuthResponse;
    res.cookie("token", token, { httpOnly: true });
    return userAuthResponse;
  }

  @Put("/:id")
  //   @UseBefore(AuthMiddleware)
  async updateUser(
    @Param("id") id: number,
    @Body() input: UpdateUserInput
  ): Promise<User> {
    return this.userService.updateUser(id, input);
  }

  @Delete("/:id")
  //   @UseBefore(AuthMiddleware)
  @OnUndefined(204)
  async deleteUser(@Param("id") id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}

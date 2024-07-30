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
  Req,
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
import { Session } from "express-session";
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
    @Req() req: Request & { session: Session },
    @Res() res: Response
  ): Promise<User> {
    return this.userService.loginUser(loginInput, req.session);
  }

  @Post("/logout")
  logout(@Req() req: Request & { session: Session }, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      }
    });
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

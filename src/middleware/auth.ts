import {
  ExpressMiddlewareInterface,
  Middleware,
  UnauthorizedError,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../domain/user/user.service";
import "express-session";
import { Inject } from "typedi";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  @Inject()
  private userService: UserService;

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (!userId) {
      throw new UnauthorizedError("Not authenticated");
    }

    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedError("User not found");
      }
      req.user = user;
      next();
    } catch (err) {
      throw new UnauthorizedError("Authentication failed");
    }
  }
}

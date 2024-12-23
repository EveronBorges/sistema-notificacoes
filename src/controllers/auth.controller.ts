import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async LogIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;

      const bearerToken = await AuthService.LogIn(email, senha);

      res.status(200).send(bearerToken);
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  }
}

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  static AuthenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const secret = process.env.JWT_SECRET || "default_secret";
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).send("Token não fornecido");
        return;
      }

      jwt.verify(token, secret, (err, _) => {
        if (err) {
          res.status(403).send("Token inválido");
          return;
        }

        next();
      });
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  }
}

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthService {
  static GenerateToken(hash: string): string {
    try {
      const secret = process.env.JWT_SECRET || "default_secret";
      const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

      return jwt.sign({ id: hash }, secret, { expiresIn: expiresIn });
    } catch (e: any) {
      throw e;
    }
  }

  static async LogIn(email: string, senha: string): Promise<string> {
    try {
      const usuario = {
        email,
        senha,
      };

      const hash = await bcrypt.hash(JSON.stringify(usuario), 15);

      const token = this.GenerateToken(hash);

      return token;
    } catch (e: any) {
      throw e;
    }
  }
}

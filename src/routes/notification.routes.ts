import { Router, Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/notifications/enviar",
  AuthMiddleware.AuthenticateToken,
  async (req: Request, res: Response) => {
    try {
      await NotificationService.Create(req.body);

      res.status(200).send("Notificação enviada");
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  }
);

export default router;

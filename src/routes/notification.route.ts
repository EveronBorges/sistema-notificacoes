import { Router, Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const router = Router();

router.post("/notifications/enviar", async (req: Request, res: Response) => {
  try {
    await NotificationService.Create(req.body);

    res.status(200).send("Notificação enviada");
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

export default router;

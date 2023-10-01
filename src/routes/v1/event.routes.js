import { Router } from "express";
import { methods as eventController } from "../../controllers/event.controller";

const router = Router();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);
router.post("/", eventController.addEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.delete("/finish/:id", eventController.finishEvent);
router.post("/participant/", eventController.addParticipant);
router.post("/participant/:id", eventController.removeParticipant);
router.get("/participant/:id", eventController.getEventsParticipant);

export default router;
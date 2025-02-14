import { Router, Request, Response } from "express";    
import { addContact, addNewsletter } from "../controllers/forms";


const router = Router();

router.post("/contact-form", addContact);
router.post("/newsletter", addNewsletter);

export default router;

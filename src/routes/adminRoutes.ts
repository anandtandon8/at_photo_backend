import { Router } from "express";    
import { addImages } from "../controllers/addImages";

const router = Router();

router.post("/addimages", addImages);

export default router;



import { Router } from "express";    
import { addContact, addNewsletter } from "../controllers/forms";
import { getImageUrls, getFavoriteImageUrls } from "../controllers/getImages";

const router = Router();

router.post("/contact-form", addContact);
router.post("/newsletter", addNewsletter);
router.get("/getimageurls", getImageUrls);
router.get("/getfavoriteimageurls", getFavoriteImageUrls);

export default router;

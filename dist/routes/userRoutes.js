"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forms_1 = require("../controllers/forms");
const router = (0, express_1.Router)();
router.post("/contact-form", forms_1.addContact);
router.post("/newsletter", forms_1.addNewsletter);
exports.default = router;

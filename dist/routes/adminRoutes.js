"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addImages_1 = require("../controllers/addImages");
const router = (0, express_1.Router)();
router.post("/addimages", addImages_1.addImages);
exports.default = router;

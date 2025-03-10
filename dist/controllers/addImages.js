"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImages = void 0;
const app_1 = require("../app");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: '/tmp/' });
const categoryArr = ['car', 'street', 'portrait', 'nature'];
exports.addImages = [
    upload.single('image'), // 'image' is the field name in the form data
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.headers.authorization !== app_1.addImagesApiKey) {
                res.status(401).json({ message: "Unauthorized, Invalid API Key", ok: false });
                return;
            }
            // Get the image file and filename from the request
            const imageFile = req.file;
            const filename = req.body.filename;
            if (!imageFile || !filename) {
                res.status(400).json({ message: "Either no image file or no filename provided", ok: false });
                return;
            }
            // Use the filename from the request
            const imagePath = path_1.default.join('/var/www/images', filename); // change to /var/www/images after testing
            // Move the file to the desired location
            fs_1.default.copyFile(imageFile.path, imagePath, (err) => {
                if (err) {
                    console.error('File move error:', err);
                    res.status(500).json({ message: "File move error", ok: false });
                    return;
                }
            });
            try {
                // Insert into the database after successful file move
                const query = 'INSERT INTO classifications VALUES ($1, $2)';
                const result = yield app_1.postgresDB.query(query, [filename, categoryArr[Math.min(Math.floor(Math.random() * categoryArr.length), categoryArr.length - 1)]]);
                if (result.rowCount === 1) {
                    res.status(200).json({ message: "Success", ok: true });
                }
                else {
                    res.status(500).json({ message: "Insert failed", ok: false });
                }
            }
            catch (error) {
                console.error('Database query error:', error);
                res.status(500).json({ message: "Error", ok: false });
            }
            return;
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: "Error", ok: false });
            return;
        }
    })
];

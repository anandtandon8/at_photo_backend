import { Request, Response } from 'express';
import { postgresDB, addImagesApiKey } from '../app';
import fs from 'fs';
import path from 'path';
import multer from 'multer';


const upload = multer({ dest: '/tmp/' });

const categoryArr: string[] = ['car', 'street', 'portrait', 'nature'];

export const addImages = [
    upload.single('image'), // 'image' is the field name in the form data
    async (req: Request, res: Response) => {
        try {
            if (req.headers.authorization !== addImagesApiKey) {
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
            const imagePath = path.join('/var/www/images', filename);  // change to /var/www/images after testing

            // Move the file to the desired location
            fs.rename(imageFile.path, imagePath, async (err) => {
                if (err) {
                    console.error('File move error:', err);
                    res.status(500).json({ message: "File move error", ok: false });
                    return;
                }

                try {
                    // Insert into the database after successful file move
                    const query = 'INSERT INTO classifications VALUES ($1, $2)';
                    const result = await postgresDB.query(query, [filename, categoryArr[Math.min(Math.floor(Math.random() * categoryArr.length), categoryArr.length - 1)]]);

                    if (result.rowCount === 1) {
                        res.status(200).json({ message: "Success", ok: true });
                    } else {
                        res.status(500).json({ message: "Insert failed", ok: false });
                    }
                } catch (error) {
                    console.error('Database query error:', error);
                    res.status(500).json({ message: "Error", ok: false });
                }
            });
            return;

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: "Error", ok: false });
            return;
        }
    }
];

import { Request, Response } from 'express';
import { postgresDB, addImagesApiKey } from '../app';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { HttpRequest } from '@aws-sdk/protocol-http';


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') })

async function getClassification(imageBuffer: Buffer): Promise<string> {
    const endpoint = 'https://s0ozky42g1.execute-api.us-east-2.amazonaws.com/default';
    const region = 'us-east-2';
    
    // Create the HTTP request object
    const request = new HttpRequest({
        hostname: 's0ozky42g1.execute-api.us-east-2.amazonaws.com',
        path: '/default',
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
        },
        body: JSON.stringify({
            image: imageBuffer.toString('base64')
        })
    });

    // Sign the request
    const signer = new SignatureV4({
        credentials: defaultProvider(),
        region: region,
        service: 'execute-api',
        sha256: Sha256
    });

    const signedRequest = await signer.sign(request);

    // Make the request
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: signedRequest.headers,
        body: signedRequest.body
    });

    if (!response.ok) {
        throw new Error(`Classification API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const apiResponse = JSON.parse(data.body);
    const result = JSON.parse(apiResponse.body);
    return result.classification;
}

export const addImages = [
    upload.single('image'), // 'image' is the field name in the form data
    async (req: MulterRequest, res: Response) => {
        try {
            console.log("received request: ", req.body.filename);
            if (req.headers.authorization !== addImagesApiKey) {
                res.status(401).json({ message: "Unauthorized, Invalid API Key", ok: false });
                return;
            }
            console.log("valid api key");
            // Get the image file and filename from the request
            const imageFile = req.file;
            const filename = req.body.filename;

            if (!imageFile || !filename) {
                res.status(400).json({ message: "Either no image file or no filename provided", ok: false });
                console.log("no image file or no filename provided");
                return;
            }

            // Use the filename from the request
            const imagePath = path.join('/var/www/images', filename);

            // Ensure the directory exists
            const dirPath = path.dirname(imagePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log("directory created");
            }

            // Move the file to the desired location
            try {
                await new Promise<void>((resolve, reject) => {
                    fs.copyFile(imageFile.path, imagePath, (err) => {
                        if (err) {
                            console.error('File move error:', err);
                            reject(err);
                        } else {
                            // Clean up the temporary file after successful copy
                            fs.unlink(imageFile.path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Failed to clean up temp file:', unlinkErr);
                                }
                                resolve();
                            });
                        }
                    });
                });
                console.log("file moved");
                // Get classification
                const imageBuffer = await fs.promises.readFile(imageFile.path);
                const classification = await getClassification(imageBuffer);
                
                // Insert into the database after successful file move
                console.log("inserting into database");
                const query = 'INSERT INTO classifications VALUES ($1, $2)';
                const result = await postgresDB.query(query, [filename, classification]);

                if (result.rowCount === 1) {
                    res.status(200).json({ message: "Success", ok: true });
                } else {
                    res.status(500).json({ message: "Insert failed", ok: false });
                }
                console.log("inserted into database");
                return;
            } catch (error) {
                console.error('Operation error:', error);
                res.status(500).json({ message: error instanceof Error ? error.message : "Error processing request", ok: false });
                return;
            }

        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: "Error", ok: false });
            return;
        }
    }
];

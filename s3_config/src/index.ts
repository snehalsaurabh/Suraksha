import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env);

const app = express();
app.use(cors());

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.AWS_REGION as string,
});

const upload = multer();

app.post('/upload', upload.single('photo'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageName = file.originalname;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: imageName,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const signedUrlParams = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: imageName,
        };
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(signedUrlParams), { expiresIn: 50000 });

        console.log(signedUrl);
        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
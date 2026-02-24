import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const endpoint = process.env.B2_ENDPOINT as string;
const s3 = new S3Client({
    endpoint: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
    region: process.env.B2_REGION as string,
    credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY as string,
    },
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const bucketName = process.env.B2_BUCKET_NAME as string;
        const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        });

        await s3.send(command);

        // Construct the public URL assuming the bucket is public
        // B2 public URL format: https://f000.backblazeb2.com/file/<bucket_name>/<file_name>
        const baseUrl = process.env.B2_ENDPOINT?.replace('s3.', 'f000.'); // Approximating the public URL root
        let publicUrl = '';
        if (process.env.B2_ENDPOINT?.includes('backblazeb2.com')) {
            publicUrl = `https://f000.backblazeb2.com/file/${bucketName}/${fileName}`;
        } else {
            publicUrl = `${process.env.B2_ENDPOINT}/${bucketName}/${fileName}`;
        }

        res.json({ success: true, url: publicUrl, fileName });
    } catch (error) {
        console.error('Error uploading to B2:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

export default router;

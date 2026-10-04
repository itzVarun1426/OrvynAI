import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Initialize AWS SDK v3 S3 Client.
// When deployed on EC2, the SDK uses the standard AWS credential provider chain
// which automatically fetches temporary credentials from the EC2 Instance IAM Role.
const s3Client = new S3Client({
    region
});

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

/**
 * Validate image file
 * @param {Object} file - Multer file object
 */
export function validateImageFile(file) {
    if (!file) {
        throw new Error('No image file provided.');
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        throw new Error('Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF.');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error('Image file is too large. Maximum allowed size is 5MB.');
    }
}

/**
 * Upload profile avatar image to AWS S3 (or fallback to local storage if S3 bucket is not set)
 * @param {Object} file - Multer file object
 * @param {string} userId - User MongoDB ID
 * @returns {Promise<string>} S3 Object Key (e.g., users/{userId}/avatars/{filename}) or local fallback path
 */
export async function uploadAvatarImage(file, userId) {
    validateImageFile(file);

    const extMap = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif'
    };
    const ext = extMap[file.mimetype] || path.extname(file.originalname) || '.jpg';
    const randomName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    const safeUserId = userId ? String(userId) : 'guest';
    const objectKey = `users/${safeUserId}/avatars/${randomName}`;

    // Upload to AWS S3 if bucket is configured
    if (bucketName) {
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
                Body: file.buffer,
                ContentType: file.mimetype
                // Private bucket: NO ACL ('public-read' omitted)
            });

            await s3Client.send(command);
            return objectKey; // Store S3 object key in database
        } catch (s3Err) {
            console.error('S3 Upload Error:', s3Err.message);
            // Fallback to local storage if S3 is unavailable or unconfigured
        }
    }

    // Local disk fallback for local development without S3
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFilename = `avatar-${safeUserId}-${randomName}`;
    const localFilePath = path.join(uploadsDir, localFilename);
    fs.writeFileSync(localFilePath, file.buffer);

    return `http://localhost:5000/uploads/${localFilename}`;
}

/**
 * Generate a presigned GET URL for reading a private S3 object.
 * @param {string} avatarRef - S3 Object Key, full URL, or local URL
 * @param {number} expiresInSeconds - Presigned URL validity duration (default: 3600 seconds / 1 hour)
 * @returns {Promise<string>} Presigned GET URL or original URL
 */
export async function getPresignedAvatarUrl(avatarRef, expiresInSeconds = 3600) {
    if (!avatarRef) {
        return '';
    }

    // If it's an S3 object key (starts with 'users/')
    if (avatarRef.startsWith('users/') && bucketName) {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: avatarRef
            });
            return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
        } catch (err) {
            console.error('Failed to generate S3 presigned URL:', err.message);
            return '';
        }
    }

    // Return external or local fallback URL as-is
    return avatarRef;
}

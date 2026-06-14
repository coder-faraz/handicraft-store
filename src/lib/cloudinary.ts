// FILE: src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Validate required env vars at module load
const requiredEnvs = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing environment variable: ${env}`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a file (Buffer, base64 string, or remote URL) to Cloudinary.
 * Files are stored under limra-store/{folder}.
 *
 * @param file    - Buffer | base64 data URI | remote URL string
 * @param folder  - Sub-folder inside limra-store (e.g. 'products', 'banners')
 * @param options - Additional Cloudinary upload options
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  options: Record<string, any> = {}
): Promise<CloudinaryUploadResult> {
  const uploadFolder = `limra-store/${folder}`;

  const uploadData: string =
    Buffer.isBuffer(file)
      ? `data:image/jpeg;base64,${file.toString('base64')}`
      : file;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      uploadData,
      {
        folder: uploadFolder,
        resource_type: 'image',
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        quality: 'auto:best',
        fetch_format: 'auto',
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload returned no result'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
  });
}

/**
 * Delete an image from Cloudinary by its publicId.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Generate a transformed Cloudinary URL (resize, crop, etc.)
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations: Record<string, any> = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
}

export default cloudinary;

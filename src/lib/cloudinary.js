import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'profile_pictures',
          public_id: filename,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

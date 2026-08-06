// Cloudinary configuration placeholder
// Install cloudinary package: npm install cloudinary
// import {v2 as cloudinary} from 'cloudinary';

const cloudinary = {
  config: (options: Record<string, string | undefined>) => options,
  uploader: {
    upload: async (file: string, options?: Record<string, unknown>) => ({ url: file, ...options }),
  },
  url: (publicId: string) => publicId,
};

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

export default cloudinary;
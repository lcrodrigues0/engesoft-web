import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const body = await req.json();
  const file = body.file; // base64 ou URL

  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "edicoes",
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
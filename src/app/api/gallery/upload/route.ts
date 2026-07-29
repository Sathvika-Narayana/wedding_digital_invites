import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploader = (formData.get("uploader") as string) || "Guest";
    const category = (formData.get("category") as string) || "Guest Photos";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique name
    const timestamp = Date.now();
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${baseName}_${timestamp}${ext}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);

    // Write file
    fs.writeFileSync(destinationPath, buffer);

    const relativeUrl = `/uploads/${uniqueFileName}`;

    // Update gallery.json
    const galleryDbPath = path.join(process.cwd(), "gallery.json");
    let gallery = [];
    if (fs.existsSync(galleryDbPath)) {
      const fileContent = fs.readFileSync(galleryDbPath, "utf-8");
      gallery = JSON.parse(fileContent || "[]");
    }

    const isVideo = file.type.startsWith("video/") || ext.toLowerCase() === ".mp4" || ext.toLowerCase() === ".mov" || ext.toLowerCase() === ".webm";

    const newMedia = {
      id: timestamp.toString(),
      url: relativeUrl,
      thumbnailUrl: relativeUrl,
      category,
      status: "pending", // All uploads start in moderation queue
      uploader,
      timestamp: new Date().toISOString(),
      type: isVideo ? "video" : "image"
    };

    gallery.push(newMedia);
    fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

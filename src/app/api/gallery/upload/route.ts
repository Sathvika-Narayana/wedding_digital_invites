import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

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

    // Generate unique name
    const timestamp = Date.now();
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${baseName}_${timestamp}${ext}`;
    
    let relativeUrl = "";

    // Local fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const destinationPath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(destinationPath, buffer);
    relativeUrl = `/uploads/${uniqueFileName}`;

    // Update gallery.json
    let gallery = [];
    const galleryDbPath = path.join(process.cwd(), "gallery.json");
    if (fs.existsSync(galleryDbPath)) {
      const fileContent = fs.readFileSync(galleryDbPath, "utf-8");
      gallery = JSON.parse(fileContent || "[]");
    }

    const isVideo = file.type.startsWith("video/") || ext.toLowerCase() === ".mp4" || ext.toLowerCase() === ".mov" || ext.toLowerCase() === ".webm";
    const isDoc = file.type.startsWith("application/") || file.type.startsWith("text/") || ext.toLowerCase() === ".doc" || ext.toLowerCase() === ".docx" || ext.toLowerCase() === ".pdf" || ext.toLowerCase() === ".txt";

    const newMedia = {
      id: timestamp.toString(),
      url: relativeUrl,
      thumbnailUrl: relativeUrl,
      category,
      status: "pending", // All uploads start in moderation queue
      uploader,
      timestamp: new Date().toISOString(),
      type: isVideo ? "video" : isDoc ? "document" : "image"
    };

    gallery.push(newMedia);
    
    fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error: any) {
    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

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

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const blob = await put(`uploads/${uniqueFileName}`, buffer, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
      });
      relativeUrl = blob.url;
    } else {
      // Local fallback
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const destinationPath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(destinationPath, buffer);
      relativeUrl = `/uploads/${uniqueFileName}`;
    }

    // Update gallery.json
    let gallery = [];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({ prefix: 'gallery.json' });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url, { cache: 'no-store' });
          if (res.ok) {
            gallery = await res.json();
          }
        }
      } catch (err) {
        console.error("Failed to read gallery from blob:", err);
      }
    } else {
      const galleryDbPath = path.join(process.cwd(), "gallery.json");
      if (fs.existsSync(galleryDbPath)) {
        const fileContent = fs.readFileSync(galleryDbPath, "utf-8");
        gallery = JSON.parse(fileContent || "[]");
      }
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
    
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put('gallery.json', JSON.stringify(gallery), { 
        access: 'public', 
        addRandomSuffix: false,
        contentType: 'application/json' 
      });
    } else {
      const galleryDbPath = path.join(process.cwd(), "gallery.json");
      fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error) {
    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

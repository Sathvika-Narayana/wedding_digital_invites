import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, uploader, category, type } = body;

    if (!url || !uploader) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let gallery = [];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({ 
          prefix: 'gallery.json',
          token: process.env.BLOB_READ_WRITE_TOKEN 
        });
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

    const timestamp = Date.now();
    const newMedia = {
      id: timestamp.toString(),
      url: url,
      thumbnailUrl: url,
      category: category || "Guest Photos",
      status: "pending",
      uploader,
      timestamp: new Date().toISOString(),
      type: type || "image"
    };

    gallery.push(newMedia);
    
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put('gallery.json', JSON.stringify(gallery), { 
        access: 'public', 
        addRandomSuffix: false,
        contentType: 'application/json',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } else {
      const galleryDbPath = path.join(process.cwd(), "gallery.json");
      fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error: any) {
    console.error("Failed to add entry:", error);
    return NextResponse.json({ error: error.message || "Failed to add entry" }, { status: 500 });
  }
}

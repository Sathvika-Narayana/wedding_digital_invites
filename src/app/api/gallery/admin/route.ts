import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "sudeepthiNayan2026";
const galleryDbPath = path.join(process.cwd(), "gallery.json");

function verifyAdmin(req: NextRequest, bodySecret?: string | null) {
  const secret = req.headers.get("x-admin-secret") || bodySecret;
  return secret === ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, mediaId, category, secret } = body;

    if (!verifyAdmin(req, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!fs.existsSync(galleryDbPath)) {
      return NextResponse.json({ error: "Gallery database not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(galleryDbPath, "utf-8");
    let gallery = JSON.parse(fileContent || "[]");

    const mediaIndex = gallery.findIndex((item: any) => item.id === mediaId);
    if (mediaIndex === -1) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    if (action === "approve") {
      gallery[mediaIndex].status = "approved";
      if (category) {
        gallery[mediaIndex].category = category;
      }
    } else if (action === "categorize") {
      if (category) {
        gallery[mediaIndex].category = category;
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");
    return NextResponse.json({ success: true, media: gallery[mediaIndex] });
  } catch (error) {
    console.error("Admin action failed:", error);
    return NextResponse.json({ error: "Admin action failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get("mediaId");
    const secret = searchParams.get("secret") || req.headers.get("x-admin-secret");

    if (!verifyAdmin(req, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mediaId) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
    }

    if (!fs.existsSync(galleryDbPath)) {
      return NextResponse.json({ error: "Gallery database not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(galleryDbPath, "utf-8");
    let gallery = JSON.parse(fileContent || "[]");

    const mediaIndex = gallery.findIndex((item: any) => item.id === mediaId);
    if (mediaIndex === -1) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    const mediaItem = gallery[mediaIndex];
    
    // Delete file from disk
    const filePathOnDisk = path.join(process.cwd(), "public", mediaItem.url);
    if (fs.existsSync(filePathOnDisk)) {
      try {
        fs.unlinkSync(filePathOnDisk);
      } catch (err) {
        console.error("Failed to delete file on disk:", err);
      }
    }

    // Remove from database
    gallery.splice(mediaIndex, 1);

    fs.writeFileSync(galleryDbPath, JSON.stringify(gallery, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete failed:", error);
    return NextResponse.json({ error: "Admin delete failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import { list } from "@vercel/blob";

const filePath = path.join(process.cwd(), "gallery.json");
const ADMIN_SECRET = process.env.ADMIN_SECRET || "sudeepthiNayan2026";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret") || req.headers.get("x-admin-secret");

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
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        gallery = JSON.parse(fileContent || "[]");
      }
    }

    // Sort newest first
    gallery.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // If admin secret matches, return everything, otherwise return only approved
    const isAdmin = secret === ADMIN_SECRET;
    if (!isAdmin) {
      gallery = gallery.filter((item: any) => item.status === "approved");
    }

    return NextResponse.json({ success: true, gallery, isAdmin });
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

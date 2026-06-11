import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "rsvps.json");
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { name, wishes, contact, queries } = await req.json();

    if (!name || !wishes) {
      return NextResponse.json({ error: "Name and wishes are required" }, { status: 400 });
    }

    const newRsvp = {
      id: Date.now().toString(),
      name,
      wishes,
      contact: contact || "",
      queries: queries || "",
      timestamp: new Date().toISOString(),
    };

    // 1. If Google Script URL is configured, use it
    if (GOOGLE_SCRIPT_URL) {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, wishes, contact, queries }),
      });
      if (!response.ok) {
        throw new Error("Failed to send RSVP to Google Sheets");
      }
      const result = await response.json();
      return NextResponse.json({ success: true, data: result });
    }

    // 2. If Vercel KV is configured, use it
    if (KV_REST_API_URL && KV_REST_API_TOKEN) {
      const response = await fetch(`${KV_REST_API_URL}/lpush/rsvps/${encodeURIComponent(JSON.stringify(newRsvp))}`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
      });
      if (!response.ok) {
        throw new Error("Failed to save to Vercel KV");
      }
      return NextResponse.json({ success: true, data: newRsvp });
    }

    // 3. Local Fallback (write to file)
    let rsvps = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      rsvps = JSON.parse(fileContent || "[]");
    }

    rsvps.push(newRsvp);
    fs.writeFileSync(filePath, JSON.stringify(rsvps, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: newRsvp });
  } catch (error) {
    console.error("Failed to save RSVP:", error);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. If Google Script URL is configured, retrieve data from it
    if (GOOGLE_SCRIPT_URL) {
      const response = await fetch(GOOGLE_SCRIPT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch RSVPs from Google Sheets");
      }
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 2. If Vercel KV is configured, retrieve data from it
    if (KV_REST_API_URL && KV_REST_API_TOKEN) {
      const response = await fetch(`${KV_REST_API_URL}/lrange/rsvps/0/-1`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch from Vercel KV");
      }
      const rawData = await response.json();
      const rsvps = (rawData.result || []).map((item: string) => JSON.parse(item));
      return NextResponse.json(rsvps);
    }

    // 3. Local Fallback (read from file)
    let rsvps = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      rsvps = JSON.parse(fileContent || "[]");
    }
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error("Failed to fetch RSVPs:", error);
    return NextResponse.json({ error: "Failed to read RSVPs" }, { status: 500 });
  }
}

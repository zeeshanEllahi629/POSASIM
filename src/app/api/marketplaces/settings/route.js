import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// For this template, we are simulating a database using a local JSON file.
// In production, replace this with your Prisma queries (e.g. prisma.marketplace_settings)

const dbPath = path.join(process.cwd(), "marketplaces_db_mock.json");

function readMockDB() {
  if (!fs.existsSync(dbPath)) return {};
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeMockDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");

    const db = readMockDB();

    if (platform) {
      return NextResponse.json({ success: true, settings: db[platform] || {} });
    }

    // Return all platforms statuses
    return NextResponse.json({ success: true, platforms: db });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { platform, settings } = await req.json();

    if (!platform || !settings) {
      return NextResponse.json({ success: false, error: "Platform and settings are required." }, { status: 400 });
    }

    const db = readMockDB();
    db[platform] = settings;
    writeMockDB(db);

    // ========================================================
    // TODO: Replace writeMockDB with your DB save logic
    // e.g. await prisma.marketplace_settings.upsert({ ... })
    // ========================================================

    return NextResponse.json({ success: true, message: "Settings saved successfully." });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

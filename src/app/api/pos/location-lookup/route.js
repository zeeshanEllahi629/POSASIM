import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get("postcode");

    if (!postcode) {
      return NextResponse.json({ success: false, error: "Postal code is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Google Maps API key is not configured in .env" }, { status: 500 });
    }

    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&key=${apiKey}`);
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      return NextResponse.json({ success: true, address: formattedAddress });
    } else {
      return NextResponse.json({ success: false, error: "Location not found for this postal code" }, { status: 404 });
    }
  } catch (error) {
    console.error("Location Lookup Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

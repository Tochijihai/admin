import type { Meta } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // モックデータを返す
    const meta: Meta = {
      reporter: "yamamoto",
      message:
        "チームリソース削除要確認",
      webLink: "/",
      privacyLink: "/",
      termsLink: undefined,
      brandColor: "#2577B1",
      isDefault: false,
    };

    return NextResponse.json(meta);
  } catch (error) {
    console.error("Error fetching meta:", error);
    return NextResponse.json({ error: "Failed to fetch meta data" }, { status: 500 });
  }
}

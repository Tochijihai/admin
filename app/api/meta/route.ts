import { NextRequest, NextResponse } from "next/server";
import type { Meta } from "@/type";

export async function GET(request: NextRequest) {
  try {
    // モックデータを返す
    const meta: Meta = {
      reporter: "名前未設定ユーザー",
      message:
        "レポーター情報が未設定です。レポート作成者がメタデータをセットアップすることでレポーター情報が表示されます。",
      webLink: "/",
      privacyLink: "/",
      termsLink: undefined,
      brandColor: "#2577B1",
      isDefault: true,
    };

    return NextResponse.json(meta);
  } catch (error) {
    console.error("Error fetching meta:", error);
    return NextResponse.json({ error: "Failed to fetch meta data" }, { status: 500 });
  }
}

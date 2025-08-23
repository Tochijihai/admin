import type { Result } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    try {
      // 完全URLを使用してpublicファイルにアクセス
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/data/reports/${slug}/hierarchical_result.json`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json() as Result;
      return NextResponse.json(result);
    } catch (fileError) {
      console.warn(`Report file not found for slug: ${slug}`, fileError);
      // ファイルが見つからない場合は404を返す
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Failed to fetch report data" }, { status: 500 });
  }
}

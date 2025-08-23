import { NextRequest, NextResponse } from "next/server";
import type { Result } from "@/type";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // slugに基づいて動的にJSONファイルを読み込む
    const filePath = join(process.cwd(), "app", "api", "reports", "[slug]", "dummy", slug, "hierarchical_result.json");

    try {
      const fileContent = await readFile(filePath, "utf-8");
      const result = JSON.parse(fileContent) as Result;
      return NextResponse.json(result);
    } catch (fileError) {
      // ファイルが見つからない場合は404を返す
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Failed to fetch report data" }, { status: 500 });
  }
}

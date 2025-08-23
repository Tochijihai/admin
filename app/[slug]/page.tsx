import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Analysis } from "@/components/report/Analysis";
import { BackButton } from "@/components/report/BackButton";
import { ClientContainer } from "@/components/report/ClientContainer";
import { Overview } from "@/components/report/Overview";
import { Reporter } from "@/components/reporter/Reporter";
import type { Meta, Result } from "@/type";
import { Box, Separator } from "@chakra-ui/react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// プリレンダリングを無効化してSSRに切り替え
export const dynamic = 'force-dynamic';

export default async function Page({ params }: PageProps) {
  const slug = (await params).slug;

  // APIからデータを取得
  const metaResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/meta`, {
    next: { tags: ["meta"] },
  });
  const resultResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/reports/${slug}`,
    {
      next: { tags: [`report-${slug}`] },
    }
  );

  if (metaResponse.status === 404 || resultResponse.status === 404) {
    return <div>レポートが見つかりません</div>;
  }

  const meta: Meta = await metaResponse.json();
  const result: Result = await resultResponse.json();

  return (
    <>
      <div className={"container"}>
        <Header />
        <Overview result={result} />
        <ClientContainer result={result} />
        <Analysis result={result} />
        <BackButton />
        <Separator my={12} maxW={"750px"} mx={"auto"} />
        <Box maxW={"750px"} mx={"auto"} mb={24}>
          <Reporter meta={meta} />
        </Box>
      </div>
      <Footer meta={meta} />
    </>
  );
}

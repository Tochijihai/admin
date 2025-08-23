import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reporter } from "@/components/reporter/Reporter";
import { Meta } from "@/type";
import { Box, Heading } from "@chakra-ui/react";
import type { Metadata } from "next";
import { AreaList } from "./areaList";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    // const metaResponse = await fetch(`${getApiBaseUrl()}/meta/metadata.json`);
    // const meta: Meta = await metaResponse.json();

    // const { getBasePath, getRelativeUrl } = await import("@/app/utils/image-src");

    // const metadata: Metadata = {
    //   title: `${meta.reporter}のレポート一覧 - 広聴AI`,
    //   description: meta.message || "",
    //   openGraph: {
    //     images: [getRelativeUrl("/meta/ogp.png")],
    //   },
    // };

    // // 静的エクスポート時はmetadataBaseを設定しない（相対パスを使用するため）
    // if (process.env.NEXT_PUBLIC_OUTPUT_MODE !== "export") {
    //   // 開発環境やSSR時のみmetadataBaseを設定
    //   const defaultHost = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    //   metadata.metadataBase = new URL(defaultHost + getBasePath());
    // }

    // return metadata;
    
    return {
      title: "広聴AI",
    };
  } catch (_e) {
    console.error("Failed to fetch metadata for generateMetadata:", _e);
    return {
      title: "広聴AI",
    };
  }
}

export default async function Page() {
  const meta: Meta = {
    "reporter": "たけし",
    "message": "私はAIではありません。",
    "webLink": "/",
    "privacyLink": "/",
    "termsLink": undefined,
    "brandColor": "#2577B1",
    "isDefault": false
  }
    return (
      <>
        <div className={"container"}>
          <Header />
          <Box mx={"auto"} maxW={"1024px"} mb={10}>
            <Box mb="12">
              <Reporter meta={meta} />
            </Box>
            <Heading textAlign={"left"} fontSize={"xl"} mb={8}>
              レポート一覧
            </Heading>
            <AreaList />
          </Box>
        </div>
        <Footer meta={meta}/>
      </>
    );
}

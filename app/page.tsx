import { AreaList } from "@/components/areaList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Reporter } from "@/components/reporter/Reporter";
import { Meta } from "@/type";
import { Box } from "@chakra-ui/react";

// プリレンダリングを無効化してSSRに切り替え
export const dynamic = 'force-dynamic';

export default async function Page() {
  const metaResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/meta`, {
    next: { tags: ["meta"] },
  });

  if (metaResponse.status === 404) {
    return <div>レポートが見つかりません</div>;
  }

  const meta: Meta = await metaResponse.json();
  
  return (
    <>
      <div className={"container"}>
        <Header />
        <Box mx={"auto"} maxW={"1024px"} mb={10}>
          <AreaList />
          <Box mb="12">
            <Reporter meta={meta} />
          </Box>
        </Box>
      </div>
      <Footer meta={meta}/>
    </>
  );
}

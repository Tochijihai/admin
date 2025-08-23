import type { Meta } from "@/type";
import { Image } from "@chakra-ui/react";
import { ReporterContent } from "./ReporterContent";

const imagePath = "https://avatar.iran.liara.run/public/boy";

async function ReporterImage({
  reporterName,
}: {
  reporterName: string;
}) {
  return <Image src={imagePath} alt={reporterName} maxW="150px" />;
}

export async function Reporter({ meta }: { meta: Meta }) {
  return (
    <ReporterContent meta={meta}>
      <ReporterImage reporterName={meta.reporter} />
    </ReporterContent>
  );
}

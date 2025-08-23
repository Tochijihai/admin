import { Box, Image, Text, VStack } from "@chakra-ui/react";


export function AreaList() {
  return (
    <VStack mt={8} mb={12} gap={0} lineHeight={2}>
      <Text fontSize="18px" fontWeight="bold">
        レポートが0件です
      </Text>
      <Text fontSize="14px" textAlign={{ md: "center" }} mt={5}>
        レポート作成が完了し公開されると、ここに一覧が表示されます。
        <Box as="br" display={{ base: "none", md: "block" }} />
        レポートが公開されるまでしばらくお待ちください。
      </Text>
      <Image src="images/report-empty.png" mt={8} />
    </VStack>
  );
};
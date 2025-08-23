"use client";

import { Flex, HStack, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <HStack justify="space-between" py="5" mb={8} mx={"auto"} maxW={"1200px"}>
      <Flex borderWidth="5px" borderColor={"black"} minWidth="180px" h="50px" justifyContent={"center"} alignItems={"center"}>
        <Text textStyle="md" fontWeight={600}>タイトル考え中...</Text>
      </Flex>
      {/* <BroadlisteningGuide /> */}
    </HStack>
  );
}

import type { Cluster } from "@/type";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { MessagesSquareIcon } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";

type Props = {
  cluster: Cluster;
};

export function ClusterOverview({ cluster }: Props) {
  return (
    <Box mx={"auto"} maxW={"750px"} mb={12}>
      <Box mb={2}>
        <Link
          id={cluster.label}
          href={`#${cluster.label}`}
          className={"headingColor"}
          position={"relative"}
          _hover={{
            "&:before": {
              content: '"#"',
              fontSize: "2xl",
              position: "absolute",
              left: "-1.4rem",
            },
          }}
        >
          <Heading fontSize={"2xl"} mb={0}>
            {cluster.label}
          </Heading>
        </Link>
        <Text fontWeight={"bold"} display={"flex"} gap={1} mt={2}>
          <MessagesSquareIcon size={20} />
          {cluster.value.toLocaleString()}件
        </Text>
      </Box>
      <Text mb={2}>{cluster.takeaway}</Text>
      <Link
        display="inline-flex"
        alignItems="center"
        gap={2}
        px={6}
        py={3}
        bg="white"
        color="blue.600"
        borderRadius="full"
        fontWeight="bold"
        fontSize="sm"
        _hover={{
          bg: "blue.50",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        transition="all 0.3s"
        boxShadow="0 2px 8px rgba(0,0,0,0.1)"
      >
        <Text>他国・地域の施策事例</Text>
        <FiArrowRight />
      </Link>
    </Box>
  );
}

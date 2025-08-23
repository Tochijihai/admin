"use client";

import { LoadingBar } from "@/components/report/LoadingBar";
import { Box, Image, Spinner, Stack, Text } from "@chakra-ui/react";

/**
 * Next.js App Router用のローディングコンポーネント
 * Server Componentのfetch処理中に自動的に表示される
 * WCAG 2.1 AA準拠のアクセシビリティ対応済み
 */
export default function Loading() {
  return (
    <>
      <div className="container">
        {/* ヘッダー部分 - 元のページと同じレイアウト */}
        <Stack
          direction="row"
          justify="space-between"
          py={{ base: 3, md: 5 }}
          mb={{ base: 6, md: 8 }}
          mx="auto"
          maxW="1200px"
          px={{ base: 4, md: 0 }}
        >
          <Image
            src="/images/dd2030-logo.svg"
            alt="デジタル民主主義2030 ロゴ"
            w={{ base: "140px", md: "180px" }}
            h={{ base: "46px", md: "60px" }}
            loading="eager"
            decoding="sync"
          />
          <Box /> {/* BroadlisteningGuideの代わりの空白スペース */}
        </Stack>

        {/* メインローディングエリア */}
        <Box
          role="main"
          aria-labelledby="loading-title"
          aria-describedby="loading-description"
        >
          <Stack
            direction="column"
            gap={{ base: 6, md: 8 }}
            py={{ base: 12, md: 16 }}
            px={{ base: 4, md: 6 }}
            maxW="800px"
            mx="auto"
            minH={{ base: "50vh", md: "60vh" }}
            justify="center"
            align="center"
          >
            {/* ローディングスピナーとテキスト */}
            <Stack
              direction="column"
              gap={{ base: 4, md: 6 }}
              align="center"
              textAlign="center"
            >
              <Box
                role="progressbar"
                aria-label="読み込み中"
                aria-valuetext="読み込み中"
              >
                <Spinner
                  size={{ base: "lg", md: "xl" }}
                  color="cyan.500"
                />
              </Box>
              
              <Text
                id="loading-title"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="medium"
                color="gray.700"
                textAlign="center"
              >
                レポートを読み込んでいます...
              </Text>
              
              <Text
                id="loading-description"
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.500"
                textAlign="center"
                maxW={{ base: "300px", md: "400px" }}
                lineHeight="1.6"
              >
                データの分析と可視化の準備をしています。しばらくお待ちください。
              </Text>
            </Stack>

            {/* プログレスバー - 既存のLoadingBarコンポーネントを活用 */}
            <Box
              w="full"
              maxW={{ base: "90%", md: "600px" }}
              role="progressbar"
              aria-label="読み込み進行状況"
            >
              <LoadingBar
                loaded={0}
                max={100}
                isVisualizing={true}
              />
            </Box>

            {/* 追加情報 */}
            <Stack
              direction="column"
              gap={{ base: 2, md: 3 }}
              opacity={0.7}
              align="center"
              textAlign="center"
            >
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="gray.400"
                textAlign="center"
              >
                初回読み込み時は時間がかかる場合があります
              </Text>
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color="gray.400"
                textAlign="center"
              >
                ネットワーク環境により表示時間が変動します
              </Text>
            </Stack>
          </Stack>
        </Box>
      </div>
      
      {/* フッター部分は簡略化 */}
      <Box
        as="footer"
        role="contentinfo"
        mt="auto"
        py={{ base: 6, md: 8 }}
        px={{ base: 4, md: 0 }}
        bg="gray.50"
      >
        <Text
          textAlign="center"
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.500"
        >
          デジタル民主主義2030
        </Text>
      </Box>
    </>
  );
}
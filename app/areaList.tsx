"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack
} from "@chakra-ui/react";
import { parse } from "csv-parse/sync";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiList, FiMap, FiSearch } from "react-icons/fi";
import { InteractiveMap } from "./InteractiveMap";

interface PopulationData {
  regionLevel: number;                        // 地域階層
  regionCode: number;                         // 地域コード
  regionName: string;                         // 地域
  totalPopulation: number;                    // 人口総数（日本人＋外国人）
  populationChangeFromLastMonth: number;      // 前月人口総数との増減
  japaneseTotal: number;                      // 人口／日本人／総数
  japaneseMale: number;                       // 人口／日本人／男
  japaneseFemale: number;                     // 人口／日本人／女
  foreignerTotal: number;                     // 人口／外国人／総数
  foreignerMale: number;                      // 人口／外国人／男
  foreignerFemale: number;                    // 人口／外国人／女
  householdTotal: number;                     // 世帯数／総世帯数
  householdJapaneseOnly: number;              // 世帯数／日本人のみの世帯数
  householdForeignerOnly: number;             // 世帯数／外国人のみの世帯数
  householdMixedNationality: number;          // 世帯数／日本人と外国人の複数国籍世帯数
}

/**
 * 東京都の市区町村データ型定義
 */
export interface TokyoArea {
  /** 市区町村ID */
  id: string;
  /** 市区町村名 */
  name: string;
  /** カテゴリ（区、市、町、村） */
  category: "区" | "市" | "町" | "村";
  /** SVG内のpath要素のdata-name属性の値 */
  svgId: string;
  /** 人口などのcsvデータ */
  populationData?: PopulationData
}
const populationDataKeys = [
  "regionLevel",
  "regionCode",
  "regionName",
  "totalPopulation",
  "populationChangeFromLastMonth",
  "japaneseTotal",
  "japaneseMale",
  "japaneseFemale",
  "foreignerTotal",
  "foreignerMale",
  "foreignerFemale",
  "householdTotal",
  "householdJapaneseOnly",
  "householdForeignerOnly",
  "householdMixedNationality",
];


/**
 * 表示モード
 */
type ViewMode = "list" | "map";

/**
 * 東京都の市区町村選択コンポーネント
 * 
 * リストモードと地図モードの2つの表示方法を提供
 * - リストモード: 検索機能付きのリスト表示
 * - 地図モード: InteractiveMapコンポーネントによるインタラクティブ地図
 */
export function AreaList() {
  /** 現在の表示モード */
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  /** 検索クエリ */
  const [searchQuery, setSearchQuery] = useState("");
  /** 選択された市区町村 */
  const [selectedArea, setSelectedArea] = useState<TokyoArea | null>(null);
  /** tokyoのデータ */
  const [tokyoData, setTokyoData] = useState<TokyoArea[]>([]);
  /** アコーディオンの展開状態 */
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    basic: false,
    population: false,
    household: false
  });

  /**
   * アコーディオンの展開/折りたたみを切り替え
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const fetchTokyoData = async () => {
    try {
      const tokyoDataRes = await fetch("/data/tokyo_areas.json")
      const popDataRes = await fetch("/data/output.csv")

      console.log()

      const tokyoData: TokyoArea[] = await tokyoDataRes.json()
      const popData: PopulationData[] = parse(await popDataRes.text(), { columns: populationDataKeys, from_line: 2 })

      setTokyoData(tokyoData.map((d) => {
        const populationData = popData.find(p => p.regionName === d.name)
        return { ...d, populationData };
      }))
    }catch (error){
      console.error('東京のデータの取得に失敗しました:', error);
    }
  }

  useEffect(() => {
    if (tokyoData.length === 0) {
      fetchTokyoData()
    }
  }, [tokyoData.length])

  /**
   * 検索クエリに基づいてフィルタリングされた市区町村リスト
   */
  const filteredAreas = useMemo(() => {
    if (!tokyoData) return tokyoData;
    return tokyoData.filter(area =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tokyoData]);

  /**
   * 市区町村選択ハンドラー
   */
  const handleAreaSelect = (area: TokyoArea) => {
    setSelectedArea(area);
  };

  /**
   * カテゴリに応じた色を取得
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "区": return "blue";
      case "市": return "green";
      case "町": return "orange";
      case "村": return "purple";
      default: return "gray";
    }
  };

  return (
    <Box maxW="6xl" mx="auto" py={8} px={4}>
      <VStack gap={6} align="stretch">
        {/* ヘッダー */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            東京都市区町村選択
          </Heading>
          <Text color="gray.600">
            リストまたは地図から市区町村を選択してください
          </Text>
        </Box>

        {/* モード切り替えボタン */}
        <HStack justify="center" gap={4}>
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            onClick={() => setViewMode("list")}
          >
            <FiList />
            <Text ml={2}>リストモード</Text>
          </Button>
          <Button
            variant={viewMode === "map" ? "primary" : "secondary"}
            onClick={() => setViewMode("map")}
          >
            <FiMap />
            <Text ml={2}>地図モード</Text>
          </Button>
        </HStack>

        {/* コンテンツエリア */}
        <Box>
          {viewMode === "list" ? (
            // リストモード
            <VStack gap={4} align="stretch">
              {/* 検索ボックス */}
              <Box position="relative">
                <Input
                  placeholder="市区町村名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="lg"
                  pl={12}
                />
                <Box position="absolute" left={4} top="50%" transform="translateY(-50%)">
                  <FiSearch color="gray" />
                </Box>
              </Box>

              {/* 検索結果統計 */}
              <Text fontSize="sm" color="gray.600">
                {filteredAreas.length}件の市区町村が見つかりました
              </Text>

              {/* 市区町村リスト */}
              <Box 
                maxH="500px" 
                overflowY="auto" 
                border="1px solid" 
                borderColor="gray.200" 
                borderRadius="md"
              >
                {filteredAreas.map((area) => (
                  <Box
                    key={area.id}
                    p={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleAreaSelect(area)}
                    bg={selectedArea?.id === area.id ? "blue.50" : "transparent"}
                  >
                    <Flex justify="space-between" align="center">
                      <HStack gap={3}>
                        <Badge colorScheme={getCategoryColor(area.category)}>
                          {area.category}
                        </Badge>
                        <Text fontWeight="medium">{area.name}</Text>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </VStack>
          ) : (
            // 地図モード
            <Box position="relative">
              <Box 
                p={6} 
                bg="white" 
                borderRadius="md" 
                border="1px solid" 
                borderColor="gray.200"
              >
                <Text mb={4} textAlign="center" color="gray.600">
                  地図上の市区町村をクリックして選択、ホバーで詳細を表示
                </Text>
                
                {/* インタラクティブ地図コンポーネント（自己完結型） */}
                <InteractiveMap
                  areas={tokyoData}
                  selectedArea={selectedArea}
                  onAreaSelect={handleAreaSelect}
                />
              </Box>

              {/* 地図モード用の市区町村リスト（サイドバー的な使用） */}
              <Box 
                mt={4} 
                p={4} 
                bg="white" 
                borderRadius="md" 
                border="1px solid" 
                borderColor="gray.200"
              >
                <Text fontWeight="bold" mb={3}>
                  市区町村一覧（{tokyoData.length}件）
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {tokyoData.slice(0, 20).map((area) => (
                    <Badge
                      key={area.id}
                      variant={selectedArea?.id === area.id ? "solid" : "outline"}
                      colorScheme={getCategoryColor(area.category)}
                      cursor="pointer"
                      onClick={() => handleAreaSelect(area)}
                      _hover={{ transform: "scale(1.05)" }}
                      transition="transform 0.2s"
                      p={2}
                    >
                      {area.name}
                    </Badge>
                  ))}
                  {tokyoData.length > 20 && (
                    <Text fontSize="sm" color="gray.500">
                      他{tokyoData.length - 20}件...
                    </Text>
                  )}
                </Flex>
              </Box>
            </Box>
          )}
        </Box>

        {/* 選択済み市区町村の表示 */}
        {selectedArea && (
          <Box 
            p={6} 
            bg="blue.50" 
            borderRadius="md" 
            border="1px solid" 
            borderColor="blue.200"
          > 
            <Flex align="center">
              <VStack align="stretch" gap={4}>
                <Flex align="center" gap={4}>
                  <Badge colorScheme={getCategoryColor(selectedArea.category)}>
                    {selectedArea.category}
                  </Badge>
                  <Heading size="md">{selectedArea.name}</Heading>
                  <Text color="gray.600">が選択されています</Text>
                </Flex>
                
                {/* 人口データの詳細情報を自作アコーディオンで表示 */}
                <VStack align="stretch" gap={2}>
                  {/* 基本人口情報 */}
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md">
                    <Flex
                      as="button"
                      w="100%"
                      p={4}
                      align="center"
                      justify="space-between"
                      bg={expandedSections.basic ? "blue.50" : "white"}
                      _hover={{ bg: expandedSections.basic ? "blue.100" : "gray.50" }}
                      transition="all 0.2s"
                      onClick={() => toggleSection('basic')}
                      borderRadius="md"
                    >
                      <Text fontWeight="medium" color="blue.700">📊 基本人口情報</Text>
                      <Text fontSize="sm">{expandedSections.basic ? '▲' : '▼'}</Text>
                    </Flex>
                    {expandedSections.basic && (
                      <VStack align="start" gap={2} p={4} pt={0}>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">人口総数（日本人＋外国人）:</Text>{' '}
                          <Text as="span" fontWeight="bold" color="blue.600">
                            {selectedArea.populationData?.totalPopulation?.toLocaleString() || 'データなし'}人
                          </Text>
                        </Text>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">前月からの増減:</Text>{' '}
                          <Text as="span" fontWeight="bold" color={
                            (selectedArea.populationData?.populationChangeFromLastMonth || 0) >= 0 ? "green.600" : "red.600"
                          }>
                            {(selectedArea.populationData?.populationChangeFromLastMonth || 0) >= 0 ? '+' : ''}
                            {selectedArea.populationData?.populationChangeFromLastMonth?.toLocaleString() || 'データなし'}人
                          </Text>
                        </Text>
                      </VStack>
                    )}
                  </Box>

                  {/* 人口内訳 */}
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md">
                    <Flex
                      as="button"
                      w="100%"
                      p={4}
                      align="center"
                      justify="space-between"
                      bg={expandedSections.population ? "green.50" : "white"}
                      _hover={{ bg: expandedSections.population ? "green.100" : "gray.50" }}
                      transition="all 0.2s"
                      onClick={() => toggleSection('population')}
                      borderRadius="md"
                    >
                      <Text fontWeight="medium" color="green.700">👥 人口内訳</Text>
                      <Text fontSize="sm">{expandedSections.population ? '▲' : '▼'}</Text>
                    </Flex>
                    {expandedSections.population && (
                      <VStack align="start" gap={3} p={4} pt={0}>
                        {/* 日本人 */}
                        <Box>
                          <Text fontWeight="medium" color="blue.700" mb={2}>🇯🇵 日本人</Text>
                          <VStack align="start" gap={1} pl={4}>
                            <Text color="gray.700">
                              総数: <Text as="span" fontWeight="bold">{selectedArea.populationData?.japaneseTotal?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                            <Text color="gray.700">
                              男性: <Text as="span" fontWeight="bold">{selectedArea.populationData?.japaneseMale?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                            <Text color="gray.700">
                              女性: <Text as="span" fontWeight="bold">{selectedArea.populationData?.japaneseFemale?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                          </VStack>
                        </Box>
                        
                        {/* 外国人 */}
                        <Box>
                          <Text fontWeight="medium" color="green.700" mb={2}>🌏 外国人</Text>
                          <VStack align="start" gap={1} pl={4}>
                            <Text color="gray.700">
                              総数: <Text as="span" fontWeight="bold">{selectedArea.populationData?.foreignerTotal?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                            <Text color="gray.700">
                              男性: <Text as="span" fontWeight="bold">{selectedArea.populationData?.foreignerMale?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                            <Text color="gray.700">
                              女性: <Text as="span" fontWeight="bold">{selectedArea.populationData?.foreignerFemale?.toLocaleString() || 'データなし'}人</Text>
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    )}
                  </Box>

                  {/* 世帯情報 */}
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md">
                    <Flex
                      as="button"
                      w="100%"
                      p={4}
                      align="center"
                      justify="space-between"
                      bg={expandedSections.household ? "purple.50" : "white"}
                      _hover={{ bg: expandedSections.household ? "purple.100" : "gray.50" }}
                      transition="all 0.2s"
                      onClick={() => toggleSection('household')}
                      borderRadius="md"
                    >
                      <Text fontWeight="medium" color="purple.700">🏠 世帯情報</Text>
                      <Text fontSize="sm">{expandedSections.household ? '▲' : '▼'}</Text>
                    </Flex>
                    {expandedSections.household && (
                      <VStack align="start" gap={2} p={4} pt={0}>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">総世帯数:</Text>{' '}
                          <Text as="span" fontWeight="bold" color="purple.600">
                            {selectedArea.populationData?.householdTotal?.toLocaleString() || 'データなし'}世帯
                          </Text>
                        </Text>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">日本人のみの世帯:</Text>{' '}
                          <Text as="span" fontWeight="bold">
                            {selectedArea.populationData?.householdJapaneseOnly?.toLocaleString() || 'データなし'}世帯
                          </Text>
                        </Text>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">外国人のみの世帯:</Text>{' '}
                          <Text as="span" fontWeight="bold">
                            {selectedArea.populationData?.householdForeignerOnly?.toLocaleString() || 'データなし'}世帯
                          </Text>
                        </Text>
                        <Text color="gray.700">
                          <Text as="span" fontWeight="medium">複数国籍世帯:</Text>{' '}
                          <Text as="span" fontWeight="bold">
                            {selectedArea.populationData?.householdMixedNationality?.toLocaleString() || 'データなし'}世帯
                          </Text>
                        </Text>
                      </VStack>
                    )}
                  </Box>
                </VStack>
              </VStack>

              {/* 分析結果へのリンク */}
              <Box marginLeft="auto">
                <NextLink href={`/${selectedArea.id}`} passHref legacyBehavior>
                  <Link
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    px={4}
                    py={2}
                    bg="blue.500"
                    color="white"
                    borderRadius="md"
                    fontWeight="medium"
                    _hover={{
                      bg: "blue.600",
                      textDecoration: "none",
                      transform: "translateY(-1px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s"
                  >
                    <Text>分析結果へ</Text>
                    <FiArrowRight />
                  </Link>
                </NextLink>
              </Box>
            </Flex>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
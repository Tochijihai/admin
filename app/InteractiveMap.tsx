"use client";

import {
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMap } from "react-icons/fi";
import { TokyoArea } from "./areaList";

/**
 * ホバー時のポップアップ情報
 */
interface HoverInfo {
  area: TokyoArea;
  x: number;
  y: number;
}

/**
 * InteractiveMapコンポーネントのプロップス
 */
interface InteractiveMapProps {
  /** 市区町村データ配列 */
  areas: TokyoArea[];
  /** 選択された市区町村 */
  selectedArea: TokyoArea | null;
  /** 市区町村選択時のコールバック */
  onAreaSelect: (area: TokyoArea) => void;
}

/**
 * 東京都インタラクティブ地図コンポーネント
 *
 * ローカルSVGファイル（public/tokyo.svg）を取得して、
 * インタラクティブな地図機能とポップアップ表示を提供する自己完結型コンポーネント
 */
export function InteractiveMap({ areas, selectedArea, onAreaSelect }: InteractiveMapProps) {
  /** パースされたSVGパス要素 */
  const [svgPaths, setSvgPaths] = useState<SVGPathData[]>([]);
  /** SVG読み込み状態 */
  const [svgLoading, setSvgLoading] = useState<boolean>(false);
  /** SVGのviewBox情報 */
  const [svgViewBox, setSvgViewBox] = useState<string>("0 0 800 600");
  /** ホバー時の情報（内部管理） */
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  /** 現在ホバー中の要素ID */
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);

  /**
   * カテゴリに応じた色を取得（ポップアップ用）
   */
  const getCategoryColorScheme = (category: string) => {
    switch (category) {
      case "区": return "blue";
      case "市": return "green";
      case "町": return "orange";
      case "村": return "purple";
      default: return "gray";
    }
  };

  /**
   * SVGパス要素のデータ型
   */
  interface SVGPathData {
    id: string;
    d: string;
    name: string | null;
    area?: TokyoArea;
  }

  /**
   * 外部SVGファイルを取得してパースする
   */
  const fetchAndSetupSVG = async () => {
    setSvgLoading(true);
    try {
      // ローカルSVGファイルを取得（public/tokyo.svg）
      const response = await fetch('/data/tokyo.svg');
      const svgText = await response.text();
      
      // SVGをパースしてpath要素を抽出
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      if (svgElement) {
        // viewBoxを取得
        const viewBox = svgElement.getAttribute('viewBox') || '0 0 800 600';
        setSvgViewBox(viewBox);
        
        // path要素を抽出してReactで使える形に変換
        const pathElements = svgDoc.querySelectorAll('path');
        const pathData: SVGPathData[] = Array.from(pathElements).map((path, index) => {
          const d = path.getAttribute('d') || '';
          const name = path.getAttribute('name');
          const area = areas.find(a => a.svgId === name);
          
          return {
            id: `path-${index}`,
            d,
            name,
            area
          };
        });
        
        setSvgPaths(pathData);
        console.log(`${pathData.length}個のpath要素をパースしました`);
      }
    } catch (error) {
      console.error('SVGファイルの取得に失敗しました:', error);
    } finally {
      setSvgLoading(false);
    }
  };


  /**
   * カテゴリに応じた基本色を取得
   */
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "区": return "#3182ce";  // 青系 - より濃く
      case "市": return "#38a169";  // 緑系 - より濃く
      case "町": return "#ed8936";  // オレンジ系 - より濃く
      case "村": return "#805ad5";  // 紫系 - より濃く
      default: return "#718096";   // グレー系 - より濃く
    }
  };

  /**
   * カテゴリに応じたホバー色を取得
   */
  const getCategoryHoverColor = (category: string): string => {
    switch (category) {
      case "区": return "#2c5aa0";  // より暗い青
      case "市": return "#2f855a";  // より暗い緑
      case "町": return "#c05621";  // より暗いオレンジ
      case "村": return "#6b46c1";  // より暗い紫
      default: return "#4a5568";   // より暗いグレー
    }
  };

  /**
   * カテゴリに応じた選択時の色を取得
   */
  const getCategorySelectedColor = (category: string): string => {
    switch (category) {
      case "区": return "#1e40af";  // 最も暗い青
      case "市": return "#166534";  // 最も暗い緑
      case "町": return "#9a3412";  // 最も暗いオレンジ
      case "村": return "#5b21b6";  // 最も暗い紫
      default: return "#2d3748";   // 最も暗いグレー
    }
  };

  // コンポーネントマウント時にSVGを取得
  useEffect(() => {
    if (svgPaths.length === 0) {
      fetchAndSetupSVG();
    }
  }, [svgPaths.length]);

  return (
    <Box
      position="relative"
      w="100%"
      h="600px"
      bg="gray.50"
      borderRadius="md"
      overflow="hidden"
    >
      {/*
        ローカルSVG地図実装:
        public/tokyo.svg を取得してインタラクティブ機能を追加。
        SVGの各path要素にイベントハンドラーを設定して、
        ホバー・クリックイベントを直接ハンドリング。
      */}
      
      {svgLoading ? (
        // ローディング表示
        <Flex 
          w="100%" 
          h="100%" 
          align="center" 
          justify="center" 
          direction="column"
          gap={4}
        >
          <FiMap size={48} color="gray" />
          <Text color="gray.600">東京都地図を読み込み中...</Text>
        </Flex>
      ) : svgPaths.length > 0 ? (
        // 安全なReact SVG要素を表示
        <Box
          w="100%"
          h="100%"
          position="relative"
        >
          <svg
            width="100%"
            height="100%"
            viewBox={svgViewBox}
            style={{
              cursor: 'pointer',
            }}
          >
            {svgPaths.map((pathData) => (
              <path
                key={pathData.id}
                d={pathData.d}
                fill={pathData.area ? (
                  selectedArea?.id === pathData.area.id
                    ? getCategorySelectedColor(pathData.area.category)
                    : hoveredPathId === pathData.id
                      ? getCategoryHoverColor(pathData.area.category)
                      : getCategoryColor(pathData.area.category)
                ) : '#e2e8f0'}
                stroke={pathData.area ? '#2d3748' : '#cbd5e0'}
                strokeWidth={hoveredPathId === pathData.id ? '2' : '1'}
                style={{
                  cursor: pathData.area ? 'pointer' : 'default',
                  transition: 'fill 0.3s ease, stroke 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (pathData.area) {
                    console.log(`mouseenter: ${pathData.area.name}`);
                    setHoveredPathId(pathData.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const svgRect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
                    setHoverInfo({
                      area: pathData.area,
                      x: e.clientX - svgRect.left,
                      y: e.clientY - svgRect.top,
                    });
                  }
                }}
                onMouseLeave={() => {
                  if (pathData.area) {
                    console.log(`mouseleave: ${pathData.area.name}`);
                    setHoveredPathId(null);
                    setHoverInfo(null);
                  }
                }}
                onClick={() => {
                  if (pathData.area) {
                    onAreaSelect(pathData.area);
                    console.log(`${pathData.area.name}が選択されました`);
                  }
                }}
              />
            ))}
          </svg>
        </Box>
      ) : (
        // エラー時のフォールバック
        <Flex 
          w="100%" 
          h="100%" 
          align="center" 
          justify="center" 
          direction="column"
          gap={4}
        >
          <FiMap size={48} color="gray" />
          <Text color="gray.600" textAlign="center">
            地図の読み込みに失敗しました
            <br />
            リストモードをご利用ください
          </Text>
        </Flex>
      )}

      {/* ホバー時のポップアップ */}
      {hoverInfo && (
        <Box
          position="absolute"
          left={hoverInfo.x + 10}
          top={hoverInfo.y - 10}
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          zIndex={10}
          minW="200px"
        >
          <VStack align="start" gap={2}>
            <HStack>
              <Badge colorScheme={getCategoryColorScheme(hoverInfo.area.category)}>
                {hoverInfo.area.category}
              </Badge>
              <Text fontWeight="bold">{hoverInfo.area.name}</Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
"use client";

import { useDevMode } from "@/contexts/dev-mode-context";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface ElementSpecs {
  tag: string;
  className: string;
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  gap?: string;
  font?: {
    family: string;
    size: string;
    weight: string;
    lineHeight: string;
  };
  color?: string;
  background?: string;
  border?: {
    width: string;
    style: string;
    color: string;
  };
  borderRadius: string;
  shadow: string;
  opacity: string;
  display: string;
  position: string;
  overflow?: string;
  rect: DOMRect;
}

function extractSpecs(element: HTMLElement): ElementSpecs {
  const computed = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const parsePixels = (value: string) => parseInt(value) || 0;

  const hasText = element.textContent && element.textContent.trim().length > 0;
  const isTextElement = ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LABEL", "BUTTON", "A"].includes(element.tagName);

  // Read border-radius from all 4 corners
  const topLeft = computed.borderTopLeftRadius;
  const topRight = computed.borderTopRightRadius;
  const bottomRight = computed.borderBottomRightRadius;
  const bottomLeft = computed.borderBottomLeftRadius;

  let borderRadius: string;
  if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
    // All corners are the same
    borderRadius = topLeft;
  } else {
    // Different corners
    borderRadius = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
  }

  // Read border properties
  const borderTopWidth = computed.borderTopWidth;
  const borderRightWidth = computed.borderRightWidth;
  const borderBottomWidth = computed.borderBottomWidth;
  const borderLeftWidth = computed.borderLeftWidth;

  let borderWidth: string;
  if (borderTopWidth === borderRightWidth && borderRightWidth === borderBottomWidth && borderBottomWidth === borderLeftWidth) {
    borderWidth = borderTopWidth;
  } else {
    borderWidth = `${borderTopWidth} ${borderRightWidth} ${borderBottomWidth} ${borderLeftWidth}`;
  }

  const hasBorder = borderTopWidth !== "0px" || borderRightWidth !== "0px" ||
                    borderBottomWidth !== "0px" || borderLeftWidth !== "0px";

  // Debug log (will be removed after verification)
  console.log("Dev Mode Inspect:", {
    tag: element.tagName,
    borderRadius,
    borderWidth,
    boxShadow: computed.boxShadow,
    opacity: computed.opacity,
    display: computed.display,
    position: computed.position,
  });

  const specs: ElementSpecs = {
    tag: element.tagName.toLowerCase(),
    className: element.className.toString().split(" ").slice(0, 2).join(".") || "",
    width: rect.width,
    height: rect.height,
    padding: {
      top: parsePixels(computed.paddingTop),
      right: parsePixels(computed.paddingRight),
      bottom: parsePixels(computed.paddingBottom),
      left: parsePixels(computed.paddingLeft),
    },
    margin: {
      top: parsePixels(computed.marginTop),
      right: parsePixels(computed.marginRight),
      bottom: parsePixels(computed.marginBottom),
      left: parsePixels(computed.marginLeft),
    },
    gap: computed.gap !== "normal" && computed.gap !== "0px" ? computed.gap : undefined,
    font: hasText || isTextElement ? {
      family: computed.fontFamily.split(",")[0].replace(/['"]/g, ""),
      size: computed.fontSize,
      weight: computed.fontWeight,
      lineHeight: computed.lineHeight,
    } : undefined,
    color: hasText || isTextElement ? rgbToHex(computed.color) : undefined,
    background: computed.backgroundColor !== "rgba(0, 0, 0, 0)" && computed.backgroundColor !== "transparent"
      ? rgbToHex(computed.backgroundColor)
      : undefined,
    border: hasBorder ? {
      width: borderWidth,
      style: computed.borderTopStyle,
      color: rgbToHex(computed.borderTopColor),
    } : undefined,
    borderRadius,
    shadow: computed.boxShadow !== "none" ? computed.boxShadow : "none",
    opacity: computed.opacity,
    display: computed.display,
    position: computed.position,
    overflow: computed.overflow !== "visible" ? computed.overflow : undefined,
    rect,
  };

  return specs;
}

function rgbToHex(rgb: string): string {
  if (rgb.startsWith("#")) return rgb;

  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return rgb;

  const [, r, g, b] = match;
  return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function copySpecsToClipboard(specs: ElementSpecs) {
  const lines: string[] = [];

  lines.push(`width: ${Math.round(specs.width)}px`);
  lines.push(`height: ${Math.round(specs.height)}px`);

  const { padding } = specs;
  if (padding.top || padding.right || padding.bottom || padding.left) {
    if (padding.top === padding.bottom && padding.left === padding.right) {
      if (padding.top === padding.left) {
        lines.push(`padding: ${padding.top}px`);
      } else {
        lines.push(`padding: ${padding.top}px ${padding.left}px`);
      }
    } else {
      lines.push(`padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`);
    }
  }

  // Always include border-radius
  if (specs.borderRadius && specs.borderRadius !== "0px") {
    lines.push(`border-radius: ${specs.borderRadius}`);
  }

  if (specs.background) {
    lines.push(`background: ${specs.background}`);
  }

  if (specs.border) {
    lines.push(`border: ${specs.border.width} ${specs.border.style} ${specs.border.color}`);
  }

  if (specs.shadow && specs.shadow !== "none") {
    lines.push(`box-shadow: ${specs.shadow}`);
  }

  if (specs.font) {
    lines.push(`font: ${specs.font.weight} ${specs.font.size}/${specs.font.lineHeight} '${specs.font.family}'`);
  }

  if (specs.color) {
    lines.push(`color: ${specs.color}`);
  }

  const fullText = lines.join("\n");
  const preview = lines.slice(0, 2).join("; ") + (lines.length > 2 ? "; ..." : "");

  navigator.clipboard.writeText(fullText);
  toast.success(`Copied! ${preview}`, { duration: 2500 });
}

function BoxModelDiagram({ padding, margin, width, height }: {
  padding: ElementSpecs["padding"];
  margin: ElementSpecs["margin"];
  width: number;
  height: number;
}) {
  const formatValue = (val: number) => val === 0 ? "-" : val.toString();

  return (
    <div className="w-full flex justify-center my-3">
      <div className="relative" style={{ width: "180px", height: "120px" }}>
        {/* Margin layer (orange) */}
        <div className="absolute inset-0 bg-[#F6A35C]/20 border border-[#F6A35C]/40 rounded flex items-center justify-center">
          {/* Margin values */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-[#F6A35C] font-mono font-bold">
            {formatValue(margin.top)}
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-[#F6A35C] font-mono font-bold">
            {formatValue(margin.right)}
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-[#F6A35C] font-mono font-bold">
            {formatValue(margin.bottom)}
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-[#F6A35C] font-mono font-bold">
            {formatValue(margin.left)}
          </div>

          {/* Padding layer (green) */}
          <div className="bg-[#93C47D]/20 border border-[#93C47D]/40 rounded" style={{
            width: "calc(100% - 32px)",
            height: "calc(100% - 32px)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Padding values */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-[#93C47D] font-mono font-bold">
              {formatValue(padding.top)}
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-[#93C47D] font-mono font-bold">
              {formatValue(padding.right)}
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-[#93C47D] font-mono font-bold">
              {formatValue(padding.bottom)}
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-[#93C47D] font-mono font-bold">
              {formatValue(padding.left)}
            </div>

            {/* Content layer (blue) */}
            <div className="bg-[#6FA8DC]/30 border border-[#6FA8DC]/50 rounded px-2 py-1 text-[10px] text-[#6FA8DC] font-mono font-bold text-center">
              {Math.round(width)} × {Math.round(height)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipPanel({ specs }: { specs: ElementSpecs }) {
  const { rect } = specs;

  // Smart positioning: right, left, or above
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 300;
    const tooltipHeight = 400; // max height
    const gap = 12;
    const viewportPadding = 16;

    let top = 0;
    let left = 0;
    let placement: "right" | "left" | "above" = "right";

    // Try right first
    if (rect.right + gap + tooltipWidth + viewportPadding < viewportWidth) {
      placement = "right";
      left = rect.right + window.scrollX + gap;
      // Vertically center
      top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
    }
    // Try left if right doesn't fit
    else if (rect.left - gap - tooltipWidth - viewportPadding > 0) {
      placement = "left";
      left = rect.left + window.scrollX - tooltipWidth - gap;
      // Vertically center
      top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
    }
    // Fall back to above
    else {
      placement = "above";
      left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
      top = rect.top + window.scrollY - tooltipHeight - gap;
    }

    // Clamp to viewport with padding
    if (top < window.scrollY + viewportPadding) {
      top = window.scrollY + viewportPadding;
    }
    if (top + tooltipHeight > window.scrollY + viewportHeight - viewportPadding) {
      top = window.scrollY + viewportHeight - tooltipHeight - viewportPadding;
    }
    if (left < viewportPadding) {
      left = viewportPadding;
    }
    if (left + tooltipWidth > viewportWidth - viewportPadding) {
      left = viewportWidth - tooltipWidth - viewportPadding;
    }

    setPosition({ top, left });
  }, [rect]);

  return (
    <>
      {/* Element outline with glow */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          border: "2px solid rgba(0, 102, 255, 0.7)",
          boxShadow: "0 0 8px rgba(0, 102, 255, 0.3)",
          zIndex: 9998,
        }}
      />

      {/* Tooltip panel */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          top: position.top,
          left: position.left,
          width: "300px",
        }}
      >
        <div
          className="bg-[#1a1a2e] text-white rounded-lg shadow-2xl overflow-hidden"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
            maxHeight: "400px",
          }}
        >
          {/* Sticky header */}
          <div className="sticky top-0 bg-[#1a1a2e] px-3 pt-3 pb-2 border-b border-white/10 z-10">
            <div className="text-blue-400 font-semibold text-[13px]">
              {specs.tag}
              {specs.className && <span className="text-gray-400">.{specs.className}</span>}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-3 pb-3" style={{
            maxHeight: "350px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) transparent",
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 4px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `}</style>

            {/* SIZE */}
            <div className="mt-3">
              <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">SIZE</div>
              <div>W: {Math.round(specs.width)}  H: {Math.round(specs.height)}</div>
            </div>

            {/* SPACING with box model */}
            <div className="mt-3">
              <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">SPACING</div>
              <BoxModelDiagram
                padding={specs.padding}
                margin={specs.margin}
                width={specs.width}
                height={specs.height}
              />
              {specs.gap && (
                <div className="text-center text-[11px] text-gray-400 mt-2">
                  Gap: {specs.gap}
                </div>
              )}
            </div>

            {/* TYPOGRAPHY */}
            {specs.font && (
              <div className="mt-3">
                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">TYPOGRAPHY</div>
                <div className="space-y-1">
                  <div>Font: {specs.font.family}</div>
                  <div>Size: {specs.font.size} / Weight: {specs.font.weight}</div>
                  <div>Line-height: {specs.font.lineHeight}</div>
                  {specs.color && (
                    <div className="flex items-center gap-2">
                      <span>Color:</span>
                      <div
                        className="w-[10px] h-[10px] rounded-sm border border-white/50 inline-block"
                        style={{ background: specs.color }}
                      />
                      <span>{specs.color}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STYLES */}
            <div className="mt-3">
              <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1.5">STYLES</div>
              <div className="space-y-1.5">
                {specs.background && (
                  <div className="flex items-center gap-2">
                    <span>Background:</span>
                    <div
                      className="w-[10px] h-[10px] rounded-sm border border-white/50 inline-block"
                      style={{ background: specs.background }}
                    />
                    <span>{specs.background}</span>
                  </div>
                )}

                {specs.border && (
                  <div className="flex items-center gap-2">
                    <span>Border: {specs.border.width} {specs.border.style}</span>
                    <div
                      className="w-[10px] h-[10px] rounded-sm border border-white/50 inline-block"
                      style={{ background: specs.border.color }}
                    />
                    <span>{specs.border.color}</span>
                  </div>
                )}

                {/* Always show border-radius */}
                <div>
                  Radius: {specs.borderRadius}
                  {specs.borderRadius.includes(" ") && (
                    <span className="text-[10px] text-gray-400 ml-1">(TL TR BR BL)</span>
                  )}
                </div>

                <div>Shadow: {specs.shadow}</div>

                <div>Opacity: {specs.opacity}</div>

                <div>Display: {specs.display}</div>

                <div>Position: {specs.position}</div>

                {specs.overflow && (
                  <div>Overflow: {specs.overflow}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function DevModeOverlay() {
  const { devMode } = useDevMode();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [specs, setSpecs] = useState<ElementSpecs | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!devMode) return;

    const element = e.target as HTMLElement;

    // Ignore the dev mode UI itself
    if (element.closest("[data-dev-mode-ui]")) {
      setHoveredElement(null);
      setSpecs(null);
      return;
    }

    // Debounce by checking if element changed
    if (element !== hoveredElement) {
      setHoveredElement(element);
      setSpecs(extractSpecs(element));
    }
  }, [devMode, hoveredElement]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!devMode || !specs) return;

    // Ignore clicks on dev mode UI
    const element = e.target as HTMLElement;
    if (element.closest("[data-dev-mode-ui]")) return;

    e.preventDefault();
    e.stopPropagation();
    copySpecsToClipboard(specs);
  }, [devMode, specs]);

  useEffect(() => {
    if (!devMode) {
      setHoveredElement(null);
      setSpecs(null);
      return;
    }

    // Throttle mousemove handler
    let rafId: number;
    const throttledHandler = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    document.addEventListener("mousemove", throttledHandler);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousemove", throttledHandler);
      document.removeEventListener("click", handleClick, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [devMode, handleMouseMove, handleClick]);

  if (!mounted || !devMode || !specs) return null;

  return createPortal(
    <div data-dev-mode-ui>
      <TooltipPanel specs={specs} />
    </div>,
    document.body
  );
}

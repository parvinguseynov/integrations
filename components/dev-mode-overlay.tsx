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
    radius: string;
  };
  shadow?: string;
  rect: DOMRect;
}

function extractSpecs(element: HTMLElement): ElementSpecs {
  const computed = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const parsePixels = (value: string) => parseInt(value) || 0;

  const hasText = element.textContent && element.textContent.trim().length > 0;
  const isTextElement = ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LABEL", "BUTTON", "A"].includes(element.tagName);

  return {
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
    border: computed.borderWidth !== "0px" ? {
      width: computed.borderWidth,
      style: computed.borderStyle,
      color: rgbToHex(computed.borderColor),
      radius: computed.borderRadius,
    } : undefined,
    shadow: computed.boxShadow !== "none" ? computed.boxShadow : undefined,
    rect,
  };
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

  if (specs.border?.radius !== "0px") {
    lines.push(`border-radius: ${specs.border.radius}`);
  }

  if (specs.background) {
    lines.push(`background: ${specs.background}`);
  }

  if (specs.font) {
    lines.push(`font: ${specs.font.weight} ${specs.font.size}/${specs.font.lineHeight} '${specs.font.family}'`);
  }

  if (specs.color) {
    lines.push(`color: ${specs.color}`);
  }

  navigator.clipboard.writeText(lines.join("\n"));
  toast.success("Copied to clipboard", { duration: 1500 });
}

function TooltipPanel({ specs }: { specs: ElementSpecs }) {
  const { rect, padding, margin } = specs;

  // Position tooltip to avoid going off-screen
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 280;
    const tooltipHeight = 400; // approximate

    let top = rect.top + window.scrollY;
    let left = rect.right + window.scrollX + 8;

    // If tooltip goes off right edge, place it on the left
    if (left + tooltipWidth > viewportWidth) {
      left = rect.left + window.scrollX - tooltipWidth - 8;
    }

    // If tooltip goes off bottom, align to bottom of element
    if (top + tooltipHeight > viewportHeight + window.scrollY) {
      top = rect.bottom + window.scrollY - tooltipHeight;
    }

    // Ensure tooltip is always visible
    if (top < window.scrollY) top = window.scrollY + 8;
    if (left < 0) left = 8;

    setPosition({ top, left });
  }, [rect]);

  return (
    <>
      {/* Element outline */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          border: "1px dashed rgba(0, 102, 255, 0.5)",
          zIndex: 9998,
        }}
      />

      {/* Padding overlay */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          background: "rgba(0, 102, 255, 0.1)",
          zIndex: 9997,
        }}
      >
        {/* Padding labels */}
        {padding.top > 0 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600 font-bold">
            {padding.top}
          </div>
        )}
        {padding.right > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-blue-600 font-bold">
            {padding.right}
          </div>
        )}
        {padding.bottom > 0 && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-600 font-bold">
            {padding.bottom}
          </div>
        )}
        {padding.left > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-blue-600 font-bold">
            {padding.left}
          </div>
        )}
      </div>

      {/* Margin overlay */}
      {(margin.top > 0 || margin.right > 0 || margin.bottom > 0 || margin.left > 0) && (
        <div
          className="pointer-events-none fixed"
          style={{
            top: rect.top + window.scrollY - margin.top,
            left: rect.left + window.scrollX - margin.left,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom,
            border: "1px dashed rgba(255, 140, 0, 0.4)",
            background: "rgba(255, 140, 0, 0.05)",
            zIndex: 9996,
          }}
        >
          {/* Margin labels */}
          {margin.top > 0 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-orange-600 font-bold">
              {margin.top}
            </div>
          )}
          {margin.right > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-orange-600 font-bold">
              {margin.right}
            </div>
          )}
          {margin.bottom > 0 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-mono text-orange-600 font-bold">
              {margin.bottom}
            </div>
          )}
          {margin.left > 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] font-mono text-orange-600 font-bold">
              {margin.left}
            </div>
          )}
        </div>
      )}

      {/* Tooltip panel */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <div
          className="bg-[#1a1a2e] text-white rounded-lg shadow-2xl p-3 max-w-[280px]"
          style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}
        >
          {/* Element info */}
          <div className="mb-2">
            <div className="text-blue-400 font-semibold">
              {specs.tag}
              {specs.className && <span className="text-gray-400">.{specs.className}</span>}
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 mb-2">
            <div className="text-gray-400 text-[9px] mb-1">DIMENSIONS</div>
            <div>{Math.round(specs.width)} × {Math.round(specs.height)}</div>
          </div>

          {/* Spacing */}
          <div className="border-t border-white/10 pt-2 mb-2">
            <div className="text-gray-400 text-[9px] mb-1">SPACING</div>
            <div>
              Padding: {specs.padding.top} {specs.padding.right} {specs.padding.bottom} {specs.padding.left}
            </div>
            {(specs.margin.top || specs.margin.right || specs.margin.bottom || specs.margin.left) ? (
              <div>
                Margin: {specs.margin.top} {specs.margin.right} {specs.margin.bottom} {specs.margin.left}
              </div>
            ) : null}
            {specs.gap && <div>Gap: {specs.gap}</div>}
          </div>

          {/* Typography */}
          {specs.font && (
            <div className="border-t border-white/10 pt-2 mb-2">
              <div className="text-gray-400 text-[9px] mb-1">TYPOGRAPHY</div>
              <div>{specs.font.family}</div>
              <div>
                {specs.font.size} / {specs.font.weight} / LH {specs.font.lineHeight}
              </div>
              {specs.color && (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-3 h-3 rounded border border-white/20"
                    style={{ background: specs.color }}
                  />
                  <span>{specs.color}</span>
                </div>
              )}
            </div>
          )}

          {/* Styles */}
          <div className="border-t border-white/10 pt-2">
            <div className="text-gray-400 text-[9px] mb-1">STYLES</div>
            {specs.background && (
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded border border-white/20"
                  style={{ background: specs.background }}
                />
                <span>BG: {specs.background}</span>
              </div>
            )}
            {specs.border && (
              <div>
                Border: {specs.border.width} {specs.border.style}
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-3 h-3 rounded border border-white/20"
                    style={{ background: specs.border.color }}
                  />
                  <span>{specs.border.color}</span>
                </div>
                {specs.border.radius !== "0px" && <div>Radius: {specs.border.radius}</div>}
              </div>
            )}
            {specs.shadow && (
              <div className="text-[10px] text-gray-300 mt-1">
                Shadow: {specs.shadow.length > 40 ? specs.shadow.substring(0, 40) + "..." : specs.shadow}
              </div>
            )}
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

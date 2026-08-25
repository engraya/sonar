import { useEffect, useRef, useState } from "react";

export interface UseChartDimensionsOptions {
  /** Fixed height in px. Ignored when `aspectRatio` is set. */
  height?: number;
  /** width / height. When set, height is derived from the measured width. */
  aspectRatio?: number;
  /** Width used before the first measurement (SSR / initial paint). */
  defaultWidth?: number;
}

export interface ChartDimensions {
  ref: React.RefObject<HTMLDivElement>;
  width: number;
  height: number;
}

/**
 * Measures a container with a ResizeObserver so charts can render at their true
 * pixel size and reflow when the container changes. Returns a ref to attach to
 * the wrapping element plus the current width/height.
 */
export function useChartDimensions(options: UseChartDimensionsOptions = {}): ChartDimensions {
  const { height = 240, aspectRatio, defaultWidth = 320 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const next = entry.contentRect.width;
        if (next > 0) setWidth(next);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const resolvedHeight = aspectRatio ? Math.round(width / aspectRatio) : height;
  return { ref, width, height: resolvedHeight };
}

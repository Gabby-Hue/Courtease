import { memo } from "react";

import { cn } from "@/lib/utils";

interface JaggedEdgeProps {
  orientation?: "down" | "up";
  teeth?: number;
  className?: string;
}

const DEFAULT_TEETH = 32;
const HEIGHT = 10;

const JaggedEdgeComponent = ({
  orientation = "down",
  teeth = DEFAULT_TEETH,
  className,
}: JaggedEdgeProps) => {
  const step = 100 / teeth;
  let path = orientation === "down" ? "M0 0" : `M0 ${HEIGHT}`;

  for (let index = 0; index < teeth; index++) {
    const startX = index * step;
    const midX = startX + step / 2;
    const endX = startX + step;

    if (orientation === "down") {
      path += ` L${midX} ${HEIGHT} L${endX} 0`;
    } else {
      path += ` L${midX} 0 L${endX} ${HEIGHT}`;
    }
  }

  path += orientation === "down"
    ? ` L100 0 V${HEIGHT} H0 Z`
    : ` L100 ${HEIGHT} V0 H0 Z`;

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
};

export const JaggedEdge = memo(JaggedEdgeComponent);

JaggedEdge.displayName = "JaggedEdge";

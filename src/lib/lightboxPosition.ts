export type LightboxPoint = {
  x: number;
  y: number;
};

export type LightboxSize = {
  width: number;
  height: number;
};

export type LightboxViewport = {
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function isAnchoredLightboxViewport(width: number) {
  return width <= 1024;
}

export function getAnchoredLightboxPosition(
  anchor: LightboxPoint,
  size: LightboxSize,
  viewport: LightboxViewport,
  padding = 16
) {
  // Keep the viewer as close as possible to the tap point while ensuring the
  // entire frame remains inside the visible viewport.
  const maxX = Math.max(padding, viewport.width - size.width - padding);
  const maxY = Math.max(padding, viewport.height - size.height - padding);

  return {
    x: clamp(anchor.x, padding, maxX),
    y: clamp(anchor.y, padding, maxY),
  };
}

/**
 * Ray-casting algorithm to check if a point is inside a polygon.
 * @param point [longitude, latitude]
 * @param polygon Coordinates array from GeoJSON Polygon (number[][][])
 */
export function isPointInPolygon(point: [number, number], polygon: number[][][]): boolean {
  const [lng, lat] = point;
  let isInside = false;

  // Most GeoJSON polygons have one ring (index 0). 
  // If there are multiple, index 0 is the exterior and others are holes.
  // For simplicity and since our areas probably don't have holes:
  const ring = polygon[0];
  
  if (!ring) return false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }

  return isInside;
}

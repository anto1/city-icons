/** A city dot on the map. x/y are percentages of the basemap width/height. */
export interface MapMarker {
  id: string;
  city: string;
  country: string;
  region: string;
  svgFilename: string;
  url: string;
  x: number;
  y: number;
}

/** A zoom preset: padded bounding box (in %) of one region's markers. */
export interface RegionView {
  label: string;
  count: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

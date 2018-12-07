declare module daum.maps {
  export class LatLng {
    constructor(lat: number, lng: number);
  }

  export class Map {
    constructor(
      container: HTMLElement,
      options?: { center: LatLng; level: number }
    );
  }

  export class InfoWindow {
    constructor(options: {
      map: Map;
      position: LatLng;
      content: HTMLElement | string;
      removable?: boolean;
    });

    open(map: Map, marker?: Marker): void;
    close(): void;
  }

  export class Marker {
    constructor(options: { map: Map; position: LatLng; clickable?: boolean });
  }
}

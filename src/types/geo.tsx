export type LatLng = {
    lat: number;
    lng: number;
};

export type PointInfo = {
    lat: number,
    lng: number,
    key: string,
    time: string,
    temp: number,
    imgUrl: string,
    imgTag: string
}

export type Point = google.maps.LatLngLiteral & { key: string } & { time: string } & { temp: string } & { imgUrl: string } & { imgTag: string }

export type MarkersProps = { points: Point[] | undefined }
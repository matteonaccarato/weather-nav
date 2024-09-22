import { LatLng } from 'types/geo'

export function getPointsBetween(p1: LatLng, p2: LatLng, n: number): LatLng[] {
    const points: LatLng[] = [];
    const deltaX = p2.lat - p1.lat;
    const deltaY = p2.lng - p1.lng;

    // Calcola i punti intermedi
    for (let i = 1; i <= n; i++) {
        const t = i / (n + 1); // Parametro t tra 0 e 1
        const lat = p1.lat + t * deltaX;
        const lng = p1.lng + t * deltaY;
        points.push({ lat, lng });
    }

    return points;
}
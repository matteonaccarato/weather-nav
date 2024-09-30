import { LatLng } from 'types/geo';

// Cuneo, Italy
export const DEFAULT_ORIGIN_PLACEHOLDER = "Cuneo, Province of Cuneo, Italy"
export const DEFAULT_ORIGIN: LatLng = {
    lat: 44.3844766,
    lng: 7.5426711
}

// Leuven, Belgium
export const DEFAULT_DESTINATION_PLACEHOLDER = "Leuven, Belgium"
export const DEFAULT_DESTINATION: LatLng = {
    lat: 50.8804063,
    lng: 4.7100338
}

// Middle Europe
export const DEFAULT_CENTER: LatLng = {
    lat: 50.8476,
    lng: 4.3572
}

export const DEFAULT_ZOOM = 4

const DUMMY_POINTS = [
    {
        "lat": 50.0647,
        "lng": 2.3514,
        "key": "425",
        "time": "21:53",
        "temp": 14.4,
        "imgUrl": "https://openweathermap.org/img/wn/04n.png",
        "imgTag": "Clouds"
    },
    {
        "lat": 49.693380000000005,
        "lng": 5.155380000000001,
        "key": "3045",
        "time": "21:53",
        "temp": 13,
        "imgUrl": "https://openweathermap.org/img/wn/10n.png",
        "imgTag": "Rain"
    },
    {
        "lat": 49.32206,
        "lng": 7.959360000000001,
        "key": "3610",
        "time": "21:53",
        "temp": 13.7,
        "imgUrl": "https://openweathermap.org/img/wn/10n.png",
        "imgTag": "Rain"
    },
    {
        "lat": 48.95074,
        "lng": 10.763340000000001,
        "key": "3083",
        "time": "21:53",
        "temp": 11.9,
        "imgUrl": "https://openweathermap.org/img/wn/04n.png",
        "imgTag": "Clouds"
    },
    {
        "lat": 48.57942,
        "lng": 13.567320000000002,
        "key": "6894",
        "time": "21:53",
        "temp": 13.1,
        "imgUrl": "https://openweathermap.org/img/wn/04n.png",
        "imgTag": "Clouds"
    },
    {
        "lat": 48.2081,
        "lng": 16.3713,
        "key": "9078",
        "time": "21:53",
        "temp": 14.8,
        "imgUrl": "https://openweathermap.org/img/wn/04n.png",
        "imgTag": "Clouds"
    }
]
"use client";

import {
    APIProvider,
    Map,
    useMap,
    AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useEffect, useState, useRef } from "react";
import trees from "../../data/trees";
// [{ name: "Oak, English", lat: 43.64, lng: -79.41, key: "ABCD" }]

export function Intro() {
    return <div style={{ height: "100vh", width: "100%" }}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={{ lat: 43.64, lng: -79.41 }}
                defaultZoom={10}
                mapId={process.env.REACT_APP_MAP_ID}>

                <Markers points={trees} />

            </Map>
        </APIProvider>
    </div>
}

type Point = google.maps.LatLngLiteral & { key: string }
type Props = { points: Point[] }

// clustering 
const Markers = ({ points }: Props) => {
    const map = useMap()
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({})
    const clusterer = useRef<MarkerClusterer | null>(null)

    useEffect(() => {
        if (!map) return
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map })
        }
    }, [map])

    // cluster together
    useEffect(() => {
        clusterer.current?.clearMarkers()
        clusterer.current?.addMarkers(Object.values(markers))
    }, [markers])

    if (!points) return

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return   // already in state
        if (!marker && !markers[key]) return // nothing to remove

        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker }
            } else {
                const newMarkers = { ...prev }
                delete newMarkers[key]
                return newMarkers
            }
        })
    }

    return <>
        {points.map(point => {
            return <AdvancedMarker
                position={point}
                key={point.key}
                ref={marker => setMarkerRef(marker, point.key)}
            >
                <span style={{ fontSize: "2rem" }}>🌳</span>
            </AdvancedMarker>
        })}
    </>
}
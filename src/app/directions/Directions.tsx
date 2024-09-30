'use client';
import s from './style.module.css'
import { useEffect, useState, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";

import { Libraries, useLoadScript } from '@react-google-maps/api';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from 'data/defaultCoordinates';
import { toast } from 'services/sweet-alert';
import { Loader } from 'components/Loader/Loader';

import { formatWeatherInfo, fetchWeatherAPI } from 'app/weather/Weather'
import { calculateHoursDifference, duration2color, weatherTag2Color } from 'services/utils';
import { LatLng, Point, MarkersProps } from 'types/geo';

type IntroProps = {
  origin: LatLng | undefined;
  destination: LatLng | undefined;
  departure_time: string;
  vehicle: string;
};

type DirectionProps = IntroProps & { setPoints: (points: Point[] | undefined) => void };

const libraries = ['places']
export function MapDirections({ origin, destination, departure_time, vehicle }: IntroProps) {
  // Points where to display weather information
  const [points, setPoints] = useState<Point[] | undefined>()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries as Libraries,
    language: "en"
  });

  if (!isLoaded) return <div style={{ height: "60vh" }} className='d-flex justify-content-center align-items-center'>
    <Loader />
  </div>;

  return (
    <>
      <div style={{ height: '60vh', width: '100%' }}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            mapId={process.env.REACT_APP_MAP_ID}
            fullscreenControl={false}
          >
            <Directions
              origin={origin}
              destination={destination}
              departure_time={departure_time}
              vehicle={vehicle}
              setPoints={setPoints}
            />

            <Markers points={points} />
          </Map>
        </APIProvider>
      </div>
    </>
  );
}

export function Directions({
  origin,
  destination,
  departure_time,
  vehicle,
  setPoints
}: DirectionProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [prevDuration, setPrevDuration] = useState<number | null>(null);
  const [prevOrigin, setPrevOrigin] = useState<LatLng | string>("");
  const [prevDestination, setPrevDestination] = useState<LatLng | string>("");
  const [prevDepartureTime, setPrevDepartureTime] = useState<string | null>(null)
  const [prevVehicle, setPrevVehicle] = useState<string | null>(null)

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // New Origin and Destination
  useEffect(() => {
    if (!routesLibrary || !map || !origin || !destination) return;
    directionsRenderer?.setMap(null);
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    if (origin && destination
      && origin === destination) {
      toast("warning", "Origin and Destination are the same")
      return
    }
    console.log('ROUTES', origin, destination);

  }, [routesLibrary, map, origin, destination, vehicle]);

  // Show route and Calculate points where to fetch WeatherAPI 
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    let duration = leg && leg.duration ? Math.round(leg.duration.value / 3600) : 1 // [hours]
    if (duration === 0)
      duration = 1 // set min duration possible

    if ((prevOrigin && prevOrigin !== "" && prevOrigin === origin
      && prevDestination && prevDestination !== "" && prevDestination === destination
      && prevDuration && Math.abs(prevDuration) === Math.abs(duration)
      && prevDepartureTime && prevDepartureTime === departure_time
      && prevVehicle && prevVehicle === vehicle)
      || !origin || !destination)
      return

    if (origin && destination
      && origin === destination) {
      toast("warning", "Origin and Destination are the same")
      return
    }

    setPrevDuration(duration)
    if (origin) setPrevOrigin(origin)
    if (destination) setPrevDestination(destination)
    setPrevDepartureTime(departure_time)
    setPrevVehicle(vehicle)
    directionsService
      .route({
        origin: origin ? origin : prevOrigin,
        destination: destination ? destination : prevDestination,
        travelMode: parseTravelMode(vehicle),
        provideRouteAlternatives: true,
      })
      .then(async (response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        // compute mid points (along the route)
        const points = await getPointsBetween(
          origin,
          destination,
          Math.floor(Math.sqrt((origin.lat - destination.lat) ** 2 + (origin.lng - destination.lng) ** 2)), // number of points to show
          duration,
          calculateHoursDifference(departure_time) // calculate time shift (hours) between now and departure time
        )
        setPoints(points)
        console.log("POINTS", points)
      })
      .catch((err) => {
        console.error(err)
        toast("error", err.message)
      });
  }, [directionsService, directionsRenderer, leg, departure_time, vehicle]);

  // console.log(routes);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  // Show leg information (kilometers, hours and alternative routes)
  return (
    <div className={`${s.navigationDescription}`}>
      <div className='d-flex flex-column align-items-center justify-content-center py-1 px-3'>
        <h5 className="d-flex justify-content-center align-items-center">
          {leg.start_address.split(',')[0]}
          <span className="material-icons material-symbols-outlined">chevron_right</span>
          {leg.end_address.split(',')[0]}
        </h5>
        <hr className={`m-1 ${s.separationRow}`} />
        <h4 className='mt-2'>{leg.distance?.text}</h4>
        <h4>{leg.duration?.text}</h4>

        {routes.length > 1 ? <>
          <hr className={`m-1 ${s.separationRow}`} />
          <h3 className='mt-2'>Alternatives</h3>
          <ul>
            {routes.map((route, index) => (
              <li key={route.summary}>
                <button
                  onClick={() => {
                    setRouteIndex(index)
                    toast("success", "Route changed")
                  }}
                  className={duration2color(routes[routeIndex].legs[0].duration?.value, route.legs[0].duration?.value)}>
                  {route.summary}
                </button>
              </li>
            ))}
          </ul>
        </> : <></>}

      </div>
    </div>
  );
}

// Get n points between p1 and p2, taking into account the duration
// Base shift is used to fetch WeatherAPI properly
async function getPointsBetween(p1: LatLng, p2: LatLng, n: number, duration: number, base_shift: number): Promise<Point[]> {
  const points: Point[] = [];
  if (duration === 0)
    return new Promise(resolve => {
      resolve(points)
    });

  // Scale and set minimum value of n
  n = Math.floor(n * .3)
  if (n < 2)
    n = 2
  // Step of hours between each point (considering the duration and the number of points)
  const hrs_step = Math.round(duration / (n + 1))
  let hrs_offset = -hrs_step

  const deltaX = p2.lat - p1.lat;
  const deltaY = p2.lng - p1.lng;

  // Compute middle points
  for (let i = 0; i <= n + 1; i++) {
    const t = i / (n + 1); // param between [0,1]
    const lat = p1.lat + t * deltaX;
    const lng = p1.lng + t * deltaY;
    const point = { lat, lng }
    const weather_point = await fetchWeatherAPI(point);
    const point_info = formatWeatherInfo(point, weather_point, hrs_offset + hrs_step + base_shift)
    hrs_offset += hrs_step
    points.push(point_info);
  }

  return new Promise(resolve => {
    resolve(points)
  });
}

const Markers = ({ points }: MarkersProps) => {
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
  // console.log(points[0])

  return <>
    {points.map((point: Point) => {
      const backgroundClass = weatherTag2Color(point.imgTag.toLowerCase())

      return <AdvancedMarker
        position={point}
        key={point.key}
        ref={marker => setMarkerRef(marker, point.key)}
        className={s.imageContainer}
      >
        <div className={`${s.container} ${backgroundClass}`}>
          <h2>{point.time}</h2>
          <h6 style={{ textAlign: "center" }}>{point.temp} °C</h6>
        </div>
        <span className={s.imageContainer}>
          <img src={`${point.imgUrl}`} alt={`${point.imgTag}`} className={s.imageCover} />
        </span>
      </AdvancedMarker>
    })}
  </>
}








const parseTravelMode = (mode: string): google.maps.TravelMode => {
  switch (mode) {
    case "BICYCLING": return google.maps.TravelMode.BICYCLING
    case "WALKING": return google.maps.TravelMode.WALKING
    default: return google.maps.TravelMode.DRIVING
  }
}
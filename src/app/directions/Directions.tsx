'use client';
import s from './style.module.css'
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import type { Marker } from "@googlemaps/markerclusterer";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import { useLoadScript } from '@react-google-maps/api';
/* import { PlacesAutoComplete } from 'components/PlacesAutoComplete/PlacesAutoComplete'; */
/* import { getPointsBetween } from 'services/utils' */

type LatLng = {
  lat: number;
  lng: number;
};
type Props = {
  origin: LatLng;
  destination: LatLng;
  departure_time: string;
  type: string;
  points: any;
  setPoints: any;
};

type PointInfo = {
  lat: number,
  lng: number,
  key: string,
  time: string,
  temp: number,
  imgUrl: string,
  imgTag: string
}

export function Intro({ origin, destination, departure_time, type }: Props) {
  const position = { lat: 50.8476, lng: 4.3572 }
  const [points, setPoints] = useState<MarkersProps>()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  console.log('IM IN INTROOO');
  console.log(position)
  return (
    <>
      <div style={{ height: '800px', width: '100%' }}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={position}
            defaultZoom={9}
            mapId={process.env.REACT_APP_MAP_ID}
            fullscreenControl={false}
          >
            {/* {selected && <Marker position={selected} />} */}
            <Directions
              origin={origin}
              destination={destination}
              departure_time={departure_time}
              type={type}
              points={points}
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
  type,
  points,
  setPoints
}: Props) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // get current location
  /* if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      p => {
        map?.setCenter({
          lat: p.coords.latitude,
          lng: p.coords.longitude
        })
      },
      err => console.error("Error while retrieving current position", err)
    )
  } else console.error("Geolocatization not supported from the browser") */

  useEffect(() => {
    if (!routesLibrary || !map || origin === '' || destination === '') return;
    directionsRenderer?.setMap(null);
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    /* const listener = google.maps.event.addListener(map, "bounds_changed", function () {
      // Riduci lo zoom di uno step rispetto a quello calcolato
      const currZoom = map.getZoom()
      map.setZoom(currZoom ? currZoom - 1 : 12);

      // Rimuovi l'ascoltatore per evitare che si ripeta
      google.maps.event.removeListener(listener);
    }); */
    console.log('ROUTES', origin, destination);

  }, [routesLibrary, map, origin, destination]);

  let tmp: LatLng[] = []

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then(async (response) => {
        // console.log(response);
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);

        /* console.log("A", points)
        const tmp = await computePoints(origin, destination)
        console.log("TMP", tmp)
        setPoints(...tmp)
        console.log("B", points) */

        /* const weather_origin = await fetchWeatherAPI(origin);
        const origin_info = formatWeatherInfo(origin, weather_origin)
        console.log(weather_origin);
        const weather_destination = await fetchWeatherAPI(destination);
        const destination_info = formatWeatherInfo(destination, weather_destination) */

        const points = await getPointsBetween(origin, destination, Math.floor(Math.sqrt((origin.lat - destination.lat) ** 2 + (origin.lng - destination.lng) ** 2)))
        setPoints(points)
        console.log("POINTS", points)

      })
      .catch((err) => console.error(err));
  }, [directionsService, directionsRenderer]);

  // console.log(routes);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  // we have a leg to work with
  return (
    <div className='directions'>
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(',')[0]} TO {leg.end_address.split(',')[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getPointsBetween(p1: LatLng, p2: LatLng, n: number): Promise<PointInfo[]> {
  n = Math.floor(n * .3)
  if (n < 2)
    n = 2
  const points: PointInfo[] = [];
  const deltaX = p2.lat - p1.lat;
  const deltaY = p2.lng - p1.lng;

  // Calcola i punti intermedi
  for (let i = 0; i <= n + 1; i++) {
    const t = i / (n + 1); // Parametro t tra 0 e 1
    const lat = p1.lat + t * deltaX;
    const lng = p1.lng + t * deltaY;
    const point = { lat, lng }
    const weather_point = await fetchWeatherAPI(point);
    const point_info = formatWeatherInfo(point, weather_point)
    // console.log(weather_point);
    points.push(point_info);
  }

  return new Promise(resolve => {
    resolve(points)
  });
}

/* const computePoints = async (origin: LatLng, destination: LatLng) => {
  const tmp: PointInfo[] = []
  const points = [
    origin,
    destination,
    ...getPointsBetween(origin, destination, Math.floor(Math.sqrt((origin.lat - destination.lat) ** 2 + (origin.lng - destination.lng) ** 2))),
  ]

  points.forEach(async (point: LatLng) => {
    const weather_point = await fetchWeatherAPI(point);
    const point_info = formatWeatherInfo(point, weather_point)
    // console.log(weather_point);
    tmp.push(point_info)
  })

  return tmp
} */

const fetchWeatherAPI = async (location: LatLng) => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;
  return (await axios.get(url)).data;
};


const formatWeatherInfo = (location: LatLng, info: any): PointInfo => {
  // use the toLocaleString() method to display the date in different timezones
  const date = new Date();
  const time = date.toLocaleString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: info.timezone
  });
  // console.log(navigator.language + "\n" + localTime + " " + city + " " + json.timezone)

  const weather = info.current.weather[0];
  const temp = Math.round((info.current.temp - 273.15) * 10) / 10;
  const imgUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`
  const imgTag = weather.main;

  return {
    lat: location.lat,
    lng: location.lng, // + .05
    key: (Math.floor(Math.random() * 10000)) + "",
    time,
    temp,
    imgUrl,
    imgTag
  }
}

type Point = google.maps.LatLngLiteral & { key: string } & { time: string } & { temp: string } & { imgUrl: string } & { imgTag: string }
type MarkersProps = { points: Point[] }

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
  console.log(points[0])

  return <>
    {points.map(point => {
      return <AdvancedMarker
        position={point}
        key={point.key}
        ref={marker => setMarkerRef(marker, point.key)}
        className={s.imageContainer}
      >
        <div className={s.container}>
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





type P = {
  setSelected: any;
  placeholder: string;
  className: string;
};

// export const PlacesAutoComplete = ({ type, name, placeholder, className, setSelected }: PlacesAutoProps) => {
export const PlacesAutoComplete = ({
  setSelected,
  placeholder,
  className,
}: P) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  // adress to lat and lg
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);
    setSelected({ lat, lng });
    console.log(lat, lng);
    // setSelected(address);
  };

  return (
    <Combobox onSelect={handleSelect} className={className}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className={`combobox-input`}
        placeholder={placeholder}
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                className='combobox-option'
                key={place_id}
                value={description}
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

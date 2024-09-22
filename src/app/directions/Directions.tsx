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

/* type PlacesAutoProps = {
  name: string,
  placeholder: string,
  type?: string,
  className?: string,
  setSelected?: any
} */


export function Intro({ origin, destination, departure_time, type }: Props) {
  const position = { lat: 43.64, lng: -79.41 };
  const [selected, setSelected] = useState<LatLng | null>(null);
  const [points, setPoints] = useState<MarkersProps>()

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  console.log('IM IN INTROOO');

  return (
    <>
      {/* <div className='places-container'>
        <PlacesAutoComplete setSelected={setSelected} />
      </div> */}

      <div style={{ height: '500px', width: '100%' }}>
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

  console.log('IM IN DIRECTIONSSS', origin, destination);

  useEffect(() => {
    if (!routesLibrary || !map || origin === '' || destination === '') return;
    directionsRenderer?.setMap(null);
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    console.log('ROUTES', origin, destination);
  }, [routesLibrary, map, origin, destination]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    console.log('CALC', origin, destination);
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

        const weather_origin = await fetchWeatherAPI(origin);
        console.log(weather_origin);




        const date = new Date();

        // use the toLocaleString() method to display the date in different timezones
        const localTime = date.toLocaleString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: weather_origin.timezone
        });
        // console.log(navigator.language + "\n" + localTime + " " + city + " " + json.timezone)

        const weather = weather_origin.current.weather[0];
        const temp = Math.round((weather_origin.current.temp - 273.15) * 10) / 10;
        const imgUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`
        const imgTag = weather.main;

        // setPoints(points.push(origin, (Math.floor(Math.random() * 12)) + ""))

        setPoints([{
          lat: 43.653226,
          lng: -79.3831843 + .05,
          key: (Math.floor(Math.random() * 12)) + "",
          imgUrl,
          imgTag
        }])



















        // const weather_destination = await fetchWeatherAPI(destination)
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

const fetchWeatherAPI = async (location: LatLng) => {
  console.log('WEATHERIIIING');
  /* let locations_info = ""
  let i = 0
  for (; i < locations.length - 1; i += 1)
    locations_info += `${locations[i].lat},${locations[i].lng}+`
  locations_info += `${locations[i].lat},${locations[i].lng}` 
  const url = `https://api.meteomatics.com/2024-09-17T00:00:00Z/t_2m:C,weather_symbol_1h:idx/${locations_info}/json`; */
  // const url = `https://api.meteomatics.com/2024-09-17T00:00:00Z/t_2m:C,weather_symbol_1h:idx/${locations[0].lat},${locations[0].lng}_${locations[1].lat},${locations[1].lng}:3/json`;

  /* const url = `https://api.meteomatics.com/2024-09-17T00:00:00Z/t_2m:C,weather_symbol_1h:idx/${location.lat},${location.lng}/json`
  const username = 'test_naccarato_matteo'; // Inserisci qui il tuo username
  const password = '--'; // Inserisci qui la tua password

  const auth = {
    username: username,
    password: password
  };

  try {
    const response = await axios.get(url, { auth });
    // console.log(response.data); // Risposta in formato HTML
    return response.data
  } catch (error) {
    console.error('Errore:', error);
  } */
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;
  const data = (await axios.get(url)).data;

  return data
};




type Point = google.maps.LatLngLiteral & { key: string } & { imgUrl: string } & { imgTag: string }
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

  return <>
    {points.map(point => {
      return <AdvancedMarker
        position={point}
        key={point.key}
        ref={marker => setMarkerRef(marker, point.key)}
        className={s.imageContainer}
      >
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

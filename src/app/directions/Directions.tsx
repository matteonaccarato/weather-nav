'use client';
import s from './style.module.css'
import axios from 'axios';
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
import { Libraries, useLoadScript } from '@react-google-maps/api';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from 'data/defaultCoordinates';
import { toast } from 'services/sweet-alert';
import { Loader } from 'components/Loader/Loader';
import { calculateHoursDifference, duration2color, weatherTag2Color } from 'services/utils';

type LatLng = {
  lat: number;
  lng: number;
};



type IntroProps = {
  origin: LatLng | undefined;
  destination: LatLng | undefined;
  departure_time: string;
  vehicle: string;
};

type DirectionProps = IntroProps & { setPoints: any };

type PointInfo = {
  lat: number,
  lng: number,
  key: string,
  time: string,
  temp: number,
  imgUrl: string,
  imgTag: string
}

const libraries = ['places']

export function Intro({ origin, destination, departure_time, vehicle }: IntroProps) {
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

  useEffect(() => {
    if (!routesLibrary || !map || !origin || !destination) return;
    directionsRenderer?.setMap(null);
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    if (origin && destination
      && origin === destination) {
      toast("error", "Origin and Destination are the same")
      return
    }
    console.log('ROUTES', origin, destination);

  }, [routesLibrary, map, origin, destination, vehicle]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const duration = leg && leg.duration ? Math.round(leg.duration.value / 3600) : 0
    console.log("DURATION", duration)
    console.log("P-DURATION", prevDuration)
    console.log(departure_time)
    if ((prevOrigin && prevOrigin !== "" && prevOrigin === origin
      && prevDestination && prevDestination !== "" && prevDestination === destination
      && prevDuration && prevDuration === duration
      && prevDepartureTime && prevDepartureTime === departure_time
      && prevVehicle && prevVehicle === vehicle)
      || !origin || !destination)
      return

    if (origin && destination
      && origin === destination) {
      toast("error", "Origin and Destination are the same")
      return
    }

    /* console.log("PREV ORIGIN", prevOrigin) */
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
        const points = await getPointsBetween(
          origin,
          destination,
          Math.floor(Math.sqrt((origin.lat - destination.lat) ** 2 + (origin.lng - destination.lng) ** 2)),
          duration,
          calculateHoursDifference(departure_time)
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

  // we have a leg to work with
  return (
    <div className={`${s.navigationDescription}`}>
      {/* <h2>{selected.summary}</h2> */}
      <div className='d-flex flex-column align-items-center justify-content-center py-1 px-3'>
        <h5 className="d-flex justify-content-center align-items-center">
          {leg.start_address.split(',')[0]}
          <span className="material-icons material-symbols-outlined">chevron_right</span>
          {leg.end_address.split(',')[0]}
        </h5>
        <hr className={`m-1 ${s.separationRow}`} />
        <h4 className='mt-2'>{leg.distance?.text}</h4>
        <h4>{leg.duration?.text}</h4>
        <hr className={`m-1 ${s.separationRow}`} />

        {routes.length > 1 ? <>
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

async function getPointsBetween(p1: LatLng, p2: LatLng, n: number, duration: number, base_shift: number): Promise<PointInfo[]> {
  n = Math.floor(n * .3)
  if (n < 2)
    n = 2
  const hrs_step = Math.round(duration / (n + 1))
  let hrs_offset = -hrs_step

  console.log("HRS_STEP", hrs_step)
  console.log(base_shift)

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
    // console.log(hrs_offset, hrs_step)
    // console.log(weather_point)
    const point_info = formatWeatherInfo(point, weather_point, hrs_offset + hrs_step + base_shift)
    hrs_offset += hrs_step
    // console.log(weather_point);
    points.push(point_info);
  }

  return new Promise(resolve => {
    resolve(points)
  });
}


const fetchWeatherAPI = async (location: LatLng) => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`;
  return (await axios.get(url)).data;
};


const formatWeatherInfo = (location: LatLng, info: any, hrs_offset: number): PointInfo => {
  // use the toLocaleString() method to display the date in different timezones
  const date = new Date()
  date.setHours(date.getHours() + hrs_offset);

  if (hrs_offset < 0)
    hrs_offset = 0
  else if (hrs_offset >= info.hourly.length)
    hrs_offset = info.hourly.length - 1
  const temp = Math.round((info.hourly[hrs_offset].temp - 273.15) * 10) / 10;
  const weather = info.hourly[hrs_offset].weather[0]
  const imgUrl = `https://openweathermap.org/img/wn/${weather.icon}.png`
  const imgTag = weather.main;

  return {
    lat: location.lat,
    lng: location.lng, // + .05
    key: (Math.floor(Math.random() * 10000)) + "",
    time: date.toLocaleString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: info.timezone
    }),
    temp,
    imgUrl,
    imgTag
  }
}

type Point = google.maps.LatLngLiteral & { key: string } & { time: string } & { temp: string } & { imgUrl: string } & { imgTag: string }
type MarkersProps = { points: Point[] | undefined }

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





type P = {
  setSelected: any;
  placeholder: string;
  className: string;
  id: string;
};

// export const PlacesAutoComplete = ({ type, name, placeholder, className, setSelected }: PlacesAutoProps) => {
export const PlacesAutoComplete = ({
  setSelected,
  placeholder,
  className,
  id
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
    document.getElementById("departure_time")?.removeAttribute("disabled")

    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect} className={`${className}`}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className='combobox-input'
        id={id}
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


const parseTravelMode = (mode: string): google.maps.TravelMode => {
  switch (mode) {
    case "BICYCLING": return google.maps.TravelMode.BICYCLING
    case "WALKING": return google.maps.TravelMode.WALKING
    default: return google.maps.TravelMode.DRIVING
  }
}
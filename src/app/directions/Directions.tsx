'use client';

import { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useApiIsLoaded,
  Marker,
} from '@vis.gl/react-google-maps';

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
  origin: LatLng | string,
  destination: LatLng | string,
  departure_time: string,
  type: string
}

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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  console.log("IM IN INTROOO")

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
            {selected && <Marker position={selected} />}
            <Directions origin={origin} destination={destination} departure_time={departure_time} type={type} />
          </Map>
        </APIProvider>
      </div>
    </>
  );
}

export function Directions({ origin, destination, departure_time, type }: Props) {
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

  console.log("IM IN DIRECTIONSSS", origin, destination)

  useEffect(() => {
    if (!routesLibrary || !map || origin === "" || destination === "") return;
    directionsRenderer?.setMap(null)
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    console.log("ROUTES", origin, destination)
  }, [routesLibrary, map, origin, destination]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    console.log("CALC", origin, destination)
    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        // console.log(response);
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      })
      .catch(err => console.error(err));
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



type P = {
  setSelected: any,
  placeholder: string,
  className: string
}

// export const PlacesAutoComplete = ({ type, name, placeholder, className, setSelected }: PlacesAutoProps) => {
export const PlacesAutoComplete = ({ setSelected, placeholder, className }: P) => {
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
    console.log(lat, lng)
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
import { Input } from 'components/Input/Input';
import s from './style.module.css'
import { useState } from 'react';
import { PlacesAutoComplete } from 'app/directions/Directions';
import { LatLng } from 'use-places-autocomplete';

import { useLoadScript } from '@react-google-maps/api';
import { toast } from 'services/sweet-alert';

type Props = {
  onLoadExample: any,
  setOrigin: any,
  setDestination: any,
  setDepartureTime: any,
  setVehicle: any
}

export function Form({ onLoadExample, setOrigin, setDestination, setDepartureTime, setVehicle }: Props) {
  const [_departureTime, _setDepartureTime] = useState<string>(new Date().toISOString()) // .slice(0, 16))

  const setDepTime = (time: string) => {
    _setDepartureTime(time)
    setDepartureTime(time)
    // Max forecast exceeded (48hrs), it will be set 48hrs 
    if ((new Date(time).getTime() - new Date().getTime()) / (1000 * 60 * 60) > 48)
      toast("warning", "Max forecast exceeded (48hrs), Last forecast loaded")
  }

  const loadExample = () => {
    onLoadExample()
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <></>;

  return <div className={`row gap-3 gap-sm-5 mb-3 mt-4 mt-sm-5`}>

    <PlacesAutoComplete
      placeholder="Origin"
      className='col-12 col-sm-3 px-0 px-sm-2'
      id="input-origin"
      setSelected={setOrigin} />

    <PlacesAutoComplete
      placeholder="Destination"
      className='col-12 col-sm-3 px-0 px-sm-2'
      id="input-destination"
      setSelected={setDestination} />

    <Input
      name='departure_time'
      placeholder=""
      id="departure_time"
      type='datetime-local'
      className={`col-12 col-sm-2 ${s.departure_time}`}
      value={_departureTime.slice(0, 16)}
      onChange={(e: any) => setDepTime(e.target.value)} />

    <select className="col-3 col-sm-1 dropdown-vehicle" defaultValue={google.maps.TravelMode.DRIVING} onSelect={setVehicle}>
      {/* <option>Vehicle</option> */}
      <option value="DRIVING">🚗</option>
      <option value="BICYCLING">🚲</option>
      <option value="WALKING">🚶‍♂️</option>
      {/* <option value={google.maps.TravelMode.DRIVING}>🚗</option>
      <option value={google.maps.TravelMode.BICYCLING}>🚲</option>
      <option value={google.maps.TravelMode.WALKING}>🚶‍♂️</option> */}
    </select>

    <button onClick={() => loadExample()} className="col-8 col-sm-1 btn btn-primary d-flex justify-content-center align-items-center gap-1 p-2">
      <span className="material-icons material-symbols-outlined">publish</span>
      Example
    </button>

  </div>;
}

import s from './style.module.css'
import { Input } from 'components/Input/Input';
import { useState } from 'react';
import { PlacesAutoComplete } from 'components/PlacesAutoComplete/PlacesAutoComplete';
import { LatLng } from 'use-places-autocomplete';

import { useLoadScript, Libraries } from '@react-google-maps/api';
import { toast } from 'services/sweet-alert';

type Props = {
  onLoadExample: () => void,
  setOrigin: (origin: LatLng | undefined) => void,
  setDestination: (destination: LatLng | undefined) => void,
  setDepartureTime: (departureTime: string) => void,
  setVehicle: (vehicle: string) => void,
  currOrigin: LatLng | undefined,
  currDestination: LatLng | undefined
}

const libraries = ['places']

export function Form({ onLoadExample, setOrigin, setDestination, setDepartureTime, setVehicle, currOrigin, currDestination }: Props) {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const [_departureTime, _setDepartureTime] = useState<string>(new Date(now.getTime() - offset).toISOString())

  const setDepTime = (time: string) => {
    _setDepartureTime(time)
    setDepartureTime(time)
    // Max forecast exceeded (48hrs), it will be set 48hrs 
    if ((new Date(time).getTime() - new Date().getTime()) / (1000 * 60 * 60) > 48)
      toast("warning", "Max forecast exceeded (48hrs), Last forecast loaded")
    else
      toast("success", "Departure time updated :)")
  }

  const loadExample = () => {
    onLoadExample()
    toast("success", "Example loaded :)")
  }

  const swapOriginDestination = () => {
    if (currOrigin && currDestination) {
      const tmp = currOrigin
      setOrigin(currDestination)
      setDestination(tmp)
      toast("success", "Swap happened,<br>Look at the map :)")
    }
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries as Libraries,
    language: "en"
  });

  if (!isLoaded) return <></>;

  return <div className={`row gap-3 gap-sm-5 mb-3 mt-4 mt-sm-5`}>

    <div className='d-flex justify-content-between align-items-center col-12 col-sm-6 px-0 px-sm-2'>
      <PlacesAutoComplete
        placeholder="Origin"
        className='w-50'
        id="input-origin"
        setSelected={setOrigin} />

      <span className={`material-icons material-symbols-outlined mx-4 ${s.swap}`} onClick={() => swapOriginDestination()}>
        swap_horiz
      </span>

      <PlacesAutoComplete
        placeholder="Destination"
        className='w-50 '
        id="input-destination"
        setSelected={setDestination} />
    </div>

    <Input
      name='departure_time'
      placeholder=""
      id="departure_time"
      type='datetime-local'
      className={`col-12 col-sm-2 ${s.departure_time}`}
      value={_departureTime.slice(0, 16)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepTime(e.target.value)} />

    <select className="col-3 col-sm-1 dropdown-vehicle" defaultValue={google.maps.TravelMode.DRIVING} onChange={e => {
      setVehicle(e.target.value)
      toast("success", "Vehicle updated :)")
    }}>
      <option value={google.maps.TravelMode.DRIVING}>🚗</option>
      <option value={google.maps.TravelMode.BICYCLING}>🚲</option>
    </select>

    <button onClick={() => loadExample()} className="col-8 col-sm-1 btn btn-primary d-flex justify-content-center align-items-center gap-1 p-2">
      <span className="material-icons material-symbols-outlined">publish</span>
      Example
    </button>

  </div>;
}

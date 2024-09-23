import { Input } from 'components/Input/Input';
import s from './style.module.css'
import { useState } from 'react';
import { PlacesAutoComplete } from 'app/directions/Directions';
import { LatLng } from 'use-places-autocomplete';

import { useLoadScript } from '@react-google-maps/api';

type Props = {
  onLoadExample: any,
  setOrigin: any,
  setDestination: any
}

export function Form({ onLoadExample, setOrigin, setDestination }: Props) {
  const [_departureTime, _setDepartureTime] = useState<string>("")

  const loadExample = () => {
    onLoadExample()
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  return <div className={`${s.container} row gap-5 mb-3`}>

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
      type='datetime-local'
      className={`col-12 col-sm-2 ${s.departure_time}`}
      value={new Date().toISOString().slice(0, 16)}
      onChange={(e: any) => _setDepartureTime(e.target.value)} />

    <select className="col-3 col-sm-1 dropdown-vehicle" defaultValue={"DRIVING"}>
      {/* <option>Vehicle</option> */}
      <option value="DRIVING">🚗</option>
      <option value="WALKING">🚶‍♂️</option>
      <option value="...">🚲</option>
    </select>

    <button onClick={() => loadExample()} className="col-7 col-sm-1 btn btn-primary d-flex justify-content-center align-items-center gap-1">
      <span className="material-icons material-symbols-outlined">publish</span>
      Example
    </button>

  </div>;
}

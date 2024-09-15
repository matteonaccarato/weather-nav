import { Input } from 'components/Input/Input';
import s from './style.module.css'
import { useState } from 'react';
import { PlacesAutoComplete } from 'app/directions/Directions';
import { LatLng } from 'use-places-autocomplete';

import { useLoadScript } from '@react-google-maps/api';

type Props = {
  onSubmit: any,
  setOrigin: any,
  setDestination: any
}

export function Form({ onSubmit, setOrigin, setDestination }: Props) {

  const [_origin, _setOrigin] = useState<LatLng | null>()
  const [_destination, _setDestination] = useState<LatLng | null>()
  const [_departureTime, _setDepartureTime] = useState<string>("")

  const submit = () => {
    //setOrigin(_origin)
    //console.log("SUBMIT", _origin)
    onSubmit()
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  return <div className={`${s.container} row gap-5`}>

    <PlacesAutoComplete
      // name='origin'
      placeholder="Origin"
      className="col-12 col-sm-3"
      setSelected={setOrigin} />

    <PlacesAutoComplete
      placeholder="Destination"
      className="col-12 col-sm-3"
      setSelected={setDestination} />

    <Input
      name='departure_time'
      placeholder=""
      type='datetime-local'
      className="col-12 col-sm-1 departure-time"
      value={new Date().toISOString().slice(0, 16)}
      onChange={(e: any) => _setDepartureTime(e.target.value)} />

    <select className="col" defaultValue={"DRIVING"}>
      {/* <option>Vehicle</option> */}
      <option value="DRIVING" className='dropdown-vehicle'>🚗</option>
      <option value="WALKING">🚶‍♂️</option>
      <option value="...">🚲</option>
    </select>

    <button onClick={() => submit()} className="col btn btn-primary">GO</button>

  </div>;
}

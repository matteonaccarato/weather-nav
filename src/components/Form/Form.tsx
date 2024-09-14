import { Input } from 'components/Input/Input';
import s from './style.module.css'
import { useState } from 'react';

type Props = {
  onSubmit: any,
  setOrigin: any
}
export function Form({ onSubmit, setOrigin }: Props) {

  const [_origin, _setOrigin] = useState<string>("")

  const submit = () => {
    onSubmit()
    setOrigin(_origin)
    console.log(_origin)
  }

  return <div className={`${s.container} row gap-5`}>

    <Input
      name='origin'
      placeholder="Origin"
      className="col-12 col-sm-3"
      onChange={(e: any) => _setOrigin(e.target.value)} />

    <Input
      name='destination'
      placeholder="Destination"
      className="col-12 col-sm-3" />

    <Input
      name='departure_time'
      placeholder=""
      type='datetime-local'
      className="col-12 col-sm-1 departure-time"
      value={new Date().toISOString().slice(0, 16)} />

    <select className="col" defaultValue={"DRIVING"}>
      {/* <option>Vehicle</option> */}
      <option value="DRIVING" className='dropdown-vehicle'>🚗</option>
      <option value="WALKING">🚶‍♂️</option>
      <option value="...">🚲</option>
    </select>

    <button onClick={() => submit()} className="col btn btn-primary">GO</button>

  </div>;
}

/* import { Intro } from './app/intro/Intro' */
/* import { Intro } from './app/markers/Markers' */
import { Intro } from './app/directions/Directions';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { Description } from './components/Description/Description'
import { useState } from 'react';
import { LatLng } from 'use-places-autocomplete';
import { DEFAULT_ORIGIN, DEFAULT_DESTINATION, DEFAULT_ORIGIN_PLACEHOLDER, DEFAULT_DESTINATION_PLACEHOLDER } from 'data/defaultCoordinates'

export function App() {
  const [origin, setOrigin] = useState<LatLng | string>("")
  const [destination, setDestination] = useState<LatLng | string>("")
  const [departureTime, setDepartureTime] = useState<string>(new Date().toISOString())//.slice(0, 16))
  const [vehicle, setVehicle] = useState<string>("DRIVING")
  /* const [vehicle, setVehicle] = useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING) */

  return (
    <div className='App'>
      <Header />
      <div className="p-4 p-sm-5">
        <Description />
        <Form
          onLoadExample={() => {
            setOrigin(DEFAULT_ORIGIN)
            setDestination(DEFAULT_DESTINATION)
            const [input_origin, input_destination] = [document.getElementById("input-origin"), document.getElementById("input-destination")]
            if (input_origin && input_destination) {
              input_origin.setAttribute("placeholder", DEFAULT_ORIGIN_PLACEHOLDER)
              input_destination.setAttribute("placeholder", DEFAULT_DESTINATION_PLACEHOLDER)
            }
            document.getElementById("departure_time")?.setAttribute("disabled", "true")
            setTimeout(() => {
              setOrigin("")
              setDestination("")
            }, 2000)
          }}
          setOrigin={setOrigin}
          setDestination={setDestination}
          setDepartureTime={setDepartureTime}
          setVehicle={setVehicle} />

        <Intro
          origin={origin}
          destination={destination}
          departure_time={departureTime}
          vehicle={vehicle} />
      </div>
    </div>
  );
}

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

  return (
    <div className='App'>
      <Header />
      <div className="main-container">
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
            setTimeout(() => {
              setOrigin("")
              setDestination("")
            }, 2000)
          }}
          setOrigin={setOrigin}
          setDestination={setDestination} />

        <Intro
          origin={origin}
          destination={destination}
          departure_time=""
          type="DRIVING" />
      </div>
    </div>
  );
}

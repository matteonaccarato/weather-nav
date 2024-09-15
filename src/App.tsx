/* import { Intro } from './app/intro/Intro' */
/* import { Intro } from './app/markers/Markers' */
import { Intro } from './app/directions/Directions';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { Description } from './components/Description/Description'
import { useState } from 'react';
import { LatLng } from 'use-places-autocomplete';

export function App() {
  const [origin, setOrigin] = useState<LatLng | string>("")
  const [destination, setDestination] = useState<LatLng | string>("")
  /* const [destination, setDestination] = useState<LatLng | string>("500 College St, Toronto ON") */

  return (
    <div className='App'>
      <Header />
      <div className="main-container">
        <Description />
        <Form
          onSubmit={() => console.log("submit", origin)}
          setOrigin={setOrigin}
          setDestination={setDestination} />

        <Intro
          //origin="100 Front St, Toronto ON"
          origin={origin}
          // origin={{ lat: 45.6460393, lng: -79.381385 }}
          // destination="500 College St, Toronto ON"
          destination={destination}
          departure_time=""
          type="DRIVING" />
      </div>
    </div>
  );
}

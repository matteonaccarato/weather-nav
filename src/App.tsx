/* import { Intro } from './app/intro/Intro' */
/* import { Intro } from './app/markers/Markers' */
import { Intro } from './app/directions/Directions';
import { Form } from './components/Form/Form';
import { Header } from './components/Header/Header';
import { Description } from './components/Description/Description'
import { useState } from 'react';

export function App() {
  const [origin, setOrigin] = useState<string>("")

  return (
    <div className='App'>
      <Header />
      <div className="main-container">
        <Description />
        <Form
          onSubmit={() => console.log("submit")}
          setOrigin={setOrigin} />
        <Intro
          origin="100 Front St, Toronto ON"
          destination="500 College St, Toronto ON"
          departure_time=""
          type="" />
      </div>
    </div>
  );
}

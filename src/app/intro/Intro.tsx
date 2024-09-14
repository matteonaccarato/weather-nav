"use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export function Intro() {
  const position = { lat: 53.54, lng: 10 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map 
        zoom={9} 
        center={position}
        mapId={process.env.REACT_APP_MAP_ID}>
          <AdvancedMarker position={position} onClick={() => setOpen(true)}>
            <Pin background={"blue"} borderColor={"green"} glyphColor={"purple"} />

            {open && <InfoWindow position={position} onCloseClick={() => setOpen(false)}><p>I'm in Hamburg</p></InfoWindow>}
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
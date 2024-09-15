'use client';

import { useEffect, useState } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    useMap,
    useMapsLibrary,
    useApiIsLoaded,
    Marker,
} from '@vis.gl/react-google-maps';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from '@reach/combobox';
import { useLoadScript } from '@react-google-maps/api';
import '@reach/combobox/styles.css';
type Props = {
    name: string,
    placeholder: string,
    type?: string,
    className?: string,
    setSelected?: any
}

// export const PlacesAutoComplete = ({ setSelected }: any) => {
/* const PlacesAutoComplete = ({ type, name, placeholder, className, setSelected }: Props) => {







    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });
    if (!isLoaded) return <div>Loading ...</div>;

    // adress to lat and lg
    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className={`combobox-input ${className}`}
                placeholder={placeholder}
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === 'OK' &&
                        data.map(({ place_id, description }) => (
                            <ComboboxOption
                                className='combobox-option'
                                key={place_id}
                                value={description}
                            />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}; */
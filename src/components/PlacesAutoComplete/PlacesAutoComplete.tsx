import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    LatLng,
} from 'use-places-autocomplete';

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

type Props = {
    setSelected: (input: LatLng | undefined) => void;
    placeholder: string;
    className: string;
    id: string;
};

export const PlacesAutoComplete = ({
    setSelected,
    placeholder,
    className,
    id
}: Props) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    // adress to lat and lg
    const handleSelect = async (address: string) => {
        document.getElementById("departure_time")?.removeAttribute("disabled")

        setValue(address, false);
        clearSuggestions();
        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);
        setSelected({ lat, lng });
    };

    return (
        <Combobox onSelect={handleSelect} className={`${className}`}>
            <ComboboxInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className='combobox-input'
                id={id}
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
};
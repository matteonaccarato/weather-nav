import s from './style.module.css'
import { useEffect, useState } from 'react';
/* import { PlacesAutoComplete } from 'app/directions/Directions'; */

type Props = {
    name: string,
    placeholder: string,
    type?: string,
    className?: string,
    value?: string,
    onChange?: any
}
type LatLng = {
    lat: number;
    lng: number;
};

export function Input({ type, name, placeholder, className, value, onChange }: Props) {
    /* const [selected, setSelected] = useState<LatLng | null>(null);

    return <PlacesAutoComplete setSelected={setSelected} /> */

    return <input
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        className={`${s.input} ${className}`}
        onChange={onChange} />
}
import s from './style.module.css'
import { useEffect, useState } from 'react';
/* import { PlacesAutoComplete } from 'app/directions/Directions'; */

type Props = {
    name: string,
    placeholder: string,
    id?: string,
    type?: string,
    className?: string,
    value?: string,
    onChange?: any
}


export function Input({ type, id, name, placeholder, className, value, onChange }: Props) {
    return <input
        id={id || ""}
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        className={`${s.input} ${className}`}
        onChange={onChange} />
}
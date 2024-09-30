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
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}


export function Input({ type, id, name, placeholder, className, value, onChange }: Props) {
    const [minDateTime, setMinDateTime] = useState("")
    useEffect(() => {
        setMinDateTime(new Date().toISOString().slice(0, 16))
    }, [])

    return <input
        id={id || ""}
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        className={`${s.input} ${className}`}
        onChange={onChange}
        min={type === "datetime-local" ? minDateTime : ""} />
}
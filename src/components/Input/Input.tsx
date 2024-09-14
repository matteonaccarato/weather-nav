import s from './style.module.css'

type Props = {
    name: string,
    placeholder: string,
    type?: string,
    className?: string,
    value?: string,
    onChange?: any
}

export function Input({ type, name, placeholder, className, value, onChange }: Props) {
    return <input
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        className={`${s.input} ${className}`}
        onChange={onChange} />
}
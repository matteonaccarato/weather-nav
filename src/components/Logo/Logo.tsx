import s from './style.module.css';

type Props = {
    image: string,
    title: string,
    subtitle: string,
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}
export function Logo({ image, title, subtitle, onClick }: Props) {
    return (
        <div onClick={onClick}>
            <div className={s.container}>
                <img className={s.img} src={image} alt='logo' />
                <div className={s.logo_txt}>{title}</div>
            </div>
            <div className={s.subtitle}>{subtitle}</div>
        </div>
    );
}

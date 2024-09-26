import s from './style.module.css'
import ghSrc from 'assets/images/github.png'

export function Footer() {
    return <div>
        <a href="https://github.com/matteonaccarato/weather-nav" target='_new' className={`${s.githubLink} w-100 d-flex justify-content-center align-items-center gap-2 `}>
            <img src={ghSrc} alt='Github logo' width={"30px"} />
            matteonaccarato/weather-nav
        </a>
    </div>
}
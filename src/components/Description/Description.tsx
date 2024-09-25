import s from './style.module.css'

export function Description() {
    return <div className='row'>
        <div className="col-12 col-sm-6">
            <h2>WHAT IS IT</h2>
            <ul>
                <li>Bored of jumping from navigator and weather apps to plan long trips by 🚗 or 🚲 ? </li>
                <li><b>ONE WEBAPP</b> to see the route to follow and the weather you will encouter when you will reach specific points along the route </li>
                <li>Click the button "example" to load an <b>EXAMPLE</b></li>
            </ul>
        </div>
        <div className="col-12 col-sm-6 mt-4 mt-sm-0">
            <h2>HOW IT WORKS</h2>
            <ul>
                <li>Enter <span className={s.field}>ORIGIN</span> <span className={s.field}>DESTINATION</span> <span className={s.field}>DEPARTURE TIME</span> and <span className={s.field}>VEHICLE</span></li>
                <li className='mt-2'><b>ENJOY :)</b></li>
                <li className={`mt-2 d-flex align-items-center gap-2 ${s.info}`}>
                    <span className="material-icons material-symbols-outlined">warning</span>
                    <span>
                        map and directions are provided by <a href='https://cloud.google.com/' target='_new' content='Link to Google Cloud'>Google Cloud</a>&nbsp;
                        (<a href='https://developers.google.com/maps' target='_new' content='Link to Google Maps API'>Developer Google Maps</a>),
                        while the weather forecast are fetched from <a href='https://openweathermap.org/' target='_new' content='Link to OpenWeatherMap'>OpenWeatherApp</a>
                    </span>
                </li>
            </ul>
        </div>
    </div>
}
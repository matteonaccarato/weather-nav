import { Logo } from 'components/Logo/Logo'
import s from './style.module.css';
import logoSrc from 'assets/images/logo.webp';

/* import { ButtonPrimary } from 'components/ButtonPrimary/ButtonPrimary'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from 'store/auth/auth-selectors'
import { AuthAPI } from 'api/auth'
import { setUser } from 'store/auth/auth-slice' */

export function Header() {
    /*const navigate = useNavigate();
     const user = useSelector(selectUser)
      const dispatch = useDispatch()
  
      const signout = () => {
          AuthAPI.signout()
          dispatch(setUser(null))
      } */

    const renderAuthProfile = () => {
        return <div>
            {/* <div>aa</div> */}
            <img src={`https://api.dicebear.com/5.x/bottts/svg?seed=aa`} alt='' style={{ width: 40 }} className="rounded-circle" />
            {/* Signout */}
            {/* <Link to="#" onClick={signout}>Signout</Link> */}
        </div>
    }

    return <div className={`row ${s.container}`}>
        <div className="col-xs-12 col-sm-4">
            <Logo onClick={() => console.log("click")} title={"weather-nav"} subtitle={""} image={logoSrc} />
        </div>
        <div className="col-xs-12 col-sm-8 text-end">
            {renderAuthProfile()}
        </div>
    </div>
}

import { Logo } from 'components/Logo/Logo'
import s from './style.module.css';
import logoSrc from 'assets/images/logo.webp';
import logoPlane from 'assets/images/logo.png'

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
        return <>
            {/* <div>aa</div> */}
            {/* <img src={`https://api.dicebear.com/5.x/bottts/svg?seed=aa`} alt='' style={{ width: 40 }} className="rounded-circle" /> */}
            <img src={logoPlane} alt='' style={{ width: 40 }} className="" />
            {/* Signout */}
            {/* <Link to="#" onClick={signout}>Signout</Link> */}
        </>
    }

    return <div className={`${s.container}`}>
        <div className="">
            <Logo onClick={() => console.log("click")} title={"weather-nav"} subtitle={""} image={logoSrc} />
        </div>
        <div className="">
            {renderAuthProfile()}
        </div>
    </div>
}

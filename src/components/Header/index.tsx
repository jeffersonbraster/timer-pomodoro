import { Container } from './styled'
import { Timer, Scroll } from 'phosphor-react'
import logoIgnite from '../../assets/logo-ignite.svg'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <Container>
      <img src={logoIgnite} alt="Logo do ignite com dois triangulos verdes" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>

        <NavLink to="/history" title="Historico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </Container>
  )
}

export default Header

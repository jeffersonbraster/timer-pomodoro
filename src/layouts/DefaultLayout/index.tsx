import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import { Container } from './styles'

const DefaultLayout = () => {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  )
}

export default DefaultLayout

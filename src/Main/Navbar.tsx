import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/esm/Nav'
import NavDropdown from 'react-bootstrap/esm/NavDropdown'
import NavbarBs from 'react-bootstrap/esm/Navbar'
import { useLocation } from 'react-router-dom'
import Logo from './Logo'
import styles from './navbar.module.scss'

type Props = {
  appContent: AppContent
}

const Navbar = ({ appContent }: Props) => {
  const { pathname } = useLocation()

  return (
    <NavbarBs bg="dark" variant="dark" expand="lg">
      {/* <Container> */}
      <div className={styles.navContainer}>
        <NavbarBs.Brand href="/">
          <Logo />
        </NavbarBs.Brand>
        <NavbarBs.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBs.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {appContent.map((e) => (
              <Nav.Link href={e.path} active={pathname === e.path} key={e.path}>
                {e.name}
              </Nav.Link>
            ))}
          </Nav>
        </NavbarBs.Collapse>
      </div>
      {/* </Container> */}
    </NavbarBs>
  )
}

export default Navbar

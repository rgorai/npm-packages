import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/esm/Nav'
import NavDropdown from 'react-bootstrap/esm/NavDropdown'
import NavbarBs from 'react-bootstrap/esm/Navbar'
import { useLocation } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import styles from '../styles/navbar.module.scss'
import Logo from './Logo'

type Props = {
  appContent: AppContent
}

const Navbar = ({ appContent }: Props) => {
  const { pathname } = useLocation()

  return (
    <NavbarBs bg="dark" variant="dark" expand="lg">
      <div className={styles.navContainer}>
        <LinkContainer to="/">
          <NavbarBs.Brand>
            <Logo />
          </NavbarBs.Brand>
        </LinkContainer>
        <NavbarBs.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBs.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {appContent.map((e) => (
              <LinkContainer to={e.path} key={e.path}>
                <Nav.Link active={pathname === e.path}>{e.name}</Nav.Link>
              </LinkContainer>
            ))}
          </Nav>
        </NavbarBs.Collapse>
      </div>
    </NavbarBs>
  )
}

export default Navbar

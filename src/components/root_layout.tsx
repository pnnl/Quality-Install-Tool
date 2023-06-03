import {FC} from 'react'

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar'
import NavbarBrand from 'react-bootstrap/NavbarBrand'

interface RootLayoutProps {
  children: React.ReactNode,
}

/**
 * The highest-level visible component for the app
 * 
 * @param children The content for the app
 *
 * @remarks
 * Provides a banner that includes a menu
 */
const RootLayout: FC<RootLayoutProps> = ({children}) => {
  return (
    <div style={{marginLeft: "auto", marginRight: "auto", maxWidth: 800, backgroundColor: "rgba(231, 231, 231)"}}>
      {/* TODO: Add a menu */}
      <Navbar style={{backgroundColor: "green"}}>
        <Container>
          <NavbarBrand><span style={{color: "gold", fontSize: "2rem"}}>BASC QA Tool</span></NavbarBrand>
        </Container>
      </Navbar>
      <div style={{paddingTop: "1rem"}}>
        {children}
      </div>
    </div>
  );
};

export default RootLayout

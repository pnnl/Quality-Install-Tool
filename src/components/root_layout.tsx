import {FC} from 'react'

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import NavBar from 'react-bootstrap/NavBar'

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
    <div style={{marginLeft: "auto", marginRight: "auto", maxWidth: 800, backgroundColor: "rgba(211, 211, 211, 0.5)"}}>
      {/* TODO: Add a menu */}
      <NavBar style={{backgroundColor: "green"}}>
        <Container>
          <NavBar.Brand><span style={{color: "gold", fontSize: "2rem"}}>BASC QA Tool</span></NavBar.Brand>
        </Container>
      </NavBar>
      <div style={{paddingTop: "1rem"}}>
        {children}
      </div>
    </div>
  );
};

export default RootLayout

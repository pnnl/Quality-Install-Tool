import {FC} from 'react'
import { Button } from 'react-bootstrap';
import { TfiAngleLeft } from "react-icons/tfi";

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image'
import NavBar from 'react-bootstrap/NavBar'
import { useLocation, Link } from "react-router-dom";

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

  const location = useLocation();

  // Regular expression pattern to match the desired paths
  const regexPatternToHome = /^(.*)\/app\/([^\/]+)$/;
  const regexPatternToHPWH = /^(.*)\/app\/qa_hpwh\/([^\/]+)$/
  const regexPatternToPlayGround = /^(.*)\/app\/playground\/([^\/]+)$/

  // Determine whether to show the back button based on the current route
  const showBackButtonToHome = regexPatternToHome.test(location.pathname);
  const showBackButtonToHPWH = regexPatternToHPWH.test(location.pathname);
  const showBackButtonToPlayGround = regexPatternToPlayGround.test(location.pathname);
  
  return (
    <div style={{marginLeft: "auto", marginRight: "auto", maxWidth: 800, backgroundColor: "rgba(231, 231, 231)"}}>
      {/* TODO: Add a menu */}
      <NavBar style={{backgroundColor: "green"}}>
        {showBackButtonToHome && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <TfiAngleLeft  style={{ marginLeft: "1rem", marginRight: "1rem", color: "white" }}/>
          </Link>
        )}
        {showBackButtonToHPWH && (
          <Link to="/app/qa_hpwh" style={{ textDecoration: "none" }}>
            <TfiAngleLeft  style={{ marginLeft: "1rem", marginRight: "1rem", color: "white" }}/>
          </Link>
        )}
        {showBackButtonToPlayGround && (
          <Link to="/app/playground" style={{ textDecoration: "none" }}>
            <TfiAngleLeft  style={{ marginLeft: "1rem", marginRight: "1rem", color: "white" }}/>
          </Link>
        )}
        <Container
        style = {{display: "flex",
        alignItems: "center",
        justifyContent: "center",}}>
          <NavBar.Brand><span style={{
            color: "gold", 
            fontSize: "2rem", 
          }}>Quality Install Tool</span></NavBar.Brand>
        </Container>
      </NavBar>
      <div style={{paddingTop: "1rem"}}>
        {children}
      </div>
    </div>
  );
};

export default RootLayout

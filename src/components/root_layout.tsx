import {FC, useEffect, useState} from 'react'
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
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const location = useLocation();

// templateName set to anything other than the empty string while showBackButton is true indicates that the 
// back button should send the user to the JobsView. templateName set to the empty string while 
// showBackButton is true indicates that the back button should send the user to the Home screen.
const [templateName, setTemplateName] = useState("");
const [showBackButton, setShowBackButton] = useState(false);

useEffect(() => {
    const regexPatternToHome = /^.*?\/app\/[^\/]+$/;
    const regexPatternToTemplate = /^.*?\/app\/([^\/]+)\/[^\/]+$/;
    const toTemplateMatchResult = location.pathname.match(regexPatternToTemplate);
    if (toTemplateMatchResult) {
        setShowBackButton(true);
        const [, capturedTemplateName] = toTemplateMatchResult;
        setTemplateName(capturedTemplateName);
    } else if (regexPatternToHome.test(location.pathname)) {
        setShowBackButton(true);
        setTemplateName("");
    } else {
        setShowBackButton(false);
        setTemplateName("");
    }
}, [location.pathname]);

  return (
    <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 800, backgroundColor: "rgba(231, 231, 231)" }}>
      <NavBar style={{ backgroundColor: "green" }}>
        {showBackButton && (
          <Link to={`/app/${templateName}`} style={{ textDecoration: "none" }}>
            <TfiAngleLeft style={{ marginLeft: "1rem", marginRight: "1rem", color: "white" }} />
          </Link>
        )}
        <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <NavBar.Brand>
            <span style={{ color: "gold", fontSize: "2rem" }}>Quality Install Tool</span>
          </NavBar.Brand>
        </Container>
      </NavBar>
      <div style={{ paddingTop: "1rem" }}>
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
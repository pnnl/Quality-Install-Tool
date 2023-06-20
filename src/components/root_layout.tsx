import {FC, useEffect, useState} from 'react'
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
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [templateName, setTemplateName] = useState("");
  const [jobName, setJobName] = useState("");
  const [showBackButtonToTemplate, setShowBackButtonToTemplate] = useState(false);

  useEffect(() => {
    const regexPatternToTemplate = /^.*?\/app\/([^\/]+)\/([^\/]+)$/;
    const show = regexPatternToTemplate.test(location.pathname);
    setShowBackButtonToTemplate(show);
    const matchResult = location.pathname.match(regexPatternToTemplate);
    if (matchResult) {
      const [, capturedTemplateName, capturedJobName] = matchResult;
      setTemplateName(capturedTemplateName);
      setJobName(capturedJobName);
    }
  }, [location.pathname]);

  const showBackButtonToHome = /^.*?\/app\/[^\/]+$/.test(location.pathname);

  return (
    <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: 800, backgroundColor: "rgba(231, 231, 231)" }}>
      <NavBar style={{ backgroundColor: "green" }}>
        {showBackButtonToHome && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <TfiAngleLeft style={{ marginLeft: "1rem", marginRight: "1rem", color: "white" }} />
          </Link>
        )}
        {showBackButtonToTemplate && templateName && jobName && (
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
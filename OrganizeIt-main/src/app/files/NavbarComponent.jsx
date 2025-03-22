// NavbarComponent.js
import React from 'react';
import { Navbar, Container, Offcanvas, Image, Nav } from 'react-bootstrap';
import Importmodal from './../Modals/importmodal';
import ExportExcel from './../functions/exportExcel';
import BottomTabBar from './BottomTabBar';
import logo from './../../logo.png';


const NavbarComponent = ({ setActiveTab, activeTab, inty }) => {
  return (
    [false].map((expand) => (
      <Navbar key={expand} bg="dark" variant="dark" expand={expand} className="mb-3" fixed="top" closevariant="white">
        <Container fluid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image 
              src={logo} 
              alt="Logo"
              style={{
                width: "35px",
                height: "35px",
                margin: "0.5rem",
              }}
            />
            <Navbar.Brand href="#">OrganizeIT Beta V-1.2</Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Hauptmenü
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="offcanvas-body"> {/* Add the 'offcanvas-body' class */}
              <div className='flex-container'> {/* Add the 'flex-container' class */}
                <p className="custom-text">Tabellen verwalten</p>
                <Importmodal setter={setActiveTab} getter={activeTab} />
                <ExportExcel />
              </div>
              <Nav className="flex-column mt-3 mb-1 nav-right" style={{ marginLeft: '2rem', fontSize: '1.0rem'  }}> {/* Add margin to the left */}
                <Nav.Link href="/account">Profil</Nav.Link>
                <Nav.Link href="/kontakte">Kontakte</Nav.Link>
                <Nav.Link href="/agbs">AGBs</Nav.Link>
                <Nav.Link href="/impressum">Impressum</Nav.Link>
                <Nav.Link href="mailto:service@fluxc.de?subject=Feedback-Prototyp">Feedback</Nav.Link>
                <div style={{ marginBottom: '1.0rem', marginTop:'3rem' , marginLeft: '3rem', color: 'white', fontSize: '0.7rem' }}> {/* Reduce the font size */}
                  &copy; {new Date().getFullYear()} OrganizeIT - FLUXC Applications UG
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <BottomTabBar inty={inty}/>
        </Container>
      </Navbar>
    ))
  );
}

export default NavbarComponent;
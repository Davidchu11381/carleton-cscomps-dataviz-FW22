import React from "react";
import {Container, Nav, Navbar} from 'react-bootstrap';

function NavbarBand() {
    return (
    
        <Navbar className="p-3" bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">MoneyFlows</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="http://localhost:3000/">Home</Nav.Link>
                <Nav.Link href="http://localhost:3000/industry">Industry</Nav.Link>
                <Nav.Link href="http://localhost:3000/congress">Congress</Nav.Link>
                <Nav.Link href="http://localhost:3000/sankey">Sankey</Nav.Link>
                <Nav.Link href="http://localhost:3000/barchart">Bar Chart</Nav.Link>
                <Nav.Link href="http://localhost:3000/aboutUs">About Us</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    
    );
}
  
export default NavbarBand;
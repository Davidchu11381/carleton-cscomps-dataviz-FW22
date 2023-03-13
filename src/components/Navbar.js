import React from "react";
import {Container, Nav, Navbar} from 'react-bootstrap';

function NavbarBand() {
    return (
        <Navbar className="p-3" bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">FollowTheMoney</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/"> Home </Nav.Link>
                <Nav.Link href="/data"> The Data </Nav.Link>
                <Nav.Link href="/aboutUs">About Us</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}
  
export default NavbarBand;
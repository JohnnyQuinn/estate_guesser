import { Container, Navbar, Overlay, Button, Popover    } from 'react-bootstrap'
import { useState, useRef } from 'react'

function NavBar() {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);


    const handleClick = (event) => {
        setShow(!show)
        setTarget(event.target);
    }
    return (
        <div className="navbar" ref={ref}>
            <Navbar >
                <Container>
                    <Navbar.Brand href="/">EstateGuesser</Navbar.Brand>
                    <Button onClick={handleClick} className="justify-content-end">?</Button>
                    <Overlay
                        show={show}
                        target={target}
                        placement="bottom"
                        container={ref}
                        containerPadding={20}
                    >
                        <Popover id="popover-contained">
                            <Popover.Header as="h3">Popover bottom</Popover.Header>
                            <Popover.Body>
                                <strong>Holy guacamole!</strong> Check this info.
                            </Popover.Body>
                        </Popover>
                    </Overlay>
                </Container>
            </Navbar>
        </div>
    )
}
export default NavBar
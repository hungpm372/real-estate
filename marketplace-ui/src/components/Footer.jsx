import React from 'react'
import { Col, Container, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faPinterest, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer-14398 text-left mt-5">
            <Container>
                <Row className='mb-5'>
                    <Col xs='4' className='offset-1'>
                        <a href="/" className="footer-site-logo">Colorlib</a>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt nemo nesciunt voluptate. Quo alias exercitationem dolorem repudiandae ex esse sapiente commodi, unde eveniet, consequatur magnam, maiores est praesentium in ipsum?</p>
                    </Col>
                    <Col xs='2' className='ml-auto'>
                        <h3>Shop</h3>
                        <ul className="list-unstyled links">
                            <li><a href="/">Sell online</a></li>
                            <li><a href="/">Features</a></li>
                            <li><a href="/">Examples</a></li>
                            <li><a href="/">Website editors</a></li>
                            <li><a href="/">Online retail</a></li>
                        </ul>
                    </Col>
                    <Col xs='2' className='ml-auto'>
                        <h3>Press</h3>
                        <ul className="list-unstyled links">
                            <li><a href="/">Events</a></li>
                            <li><a href="/">News</a></li>
                            <li><a href="/">Awards</a></li>
                            <li><a href="/">Testimonials</a></li>
                            <li><a href="/">Online retail</a></li>
                        </ul>
                    </Col>
                    <Col xs='2' className='ml-auto'>
                        <h3>About</h3>
                        <ul className="list-unstyled links">
                            <li><a href="/">Contact</a></li>
                            <li><a href="/">Services</a></li>
                            <li><a href="/">Team</a></li>
                            <li><a href="/">Career</a></li>
                            <li><a href="/">Contacts</a></li>
                        </ul>
                    </Col>
                </Row>

                <Row className="row mb-4">
                    <Col xs='10' className="pb-4 offset-1">
                        <div className="line"></div>
                    </Col>
                    <Col xs='6' className='text-md-left offset-1'>
                        <ul className="list-unstyled link-menu nav-left">
                            <li><a href="/">Privacy Policy</a></li>
                            <li><a href="/">Terms &amp; Conditions</a></li>
                            <li><a href="/">Code of Conduct</a></li>
                        </ul>
                    </Col>
                    <Col xs='2' className='text-md-right offset-9'>
                        <ul className="list-unstyled social nav-right">
                            <li><a href="/">
                                <FontAwesomeIcon className="icon-twitter" icon={faTwitter} /></a></li>
                            <li><a href="/">
                                <FontAwesomeIcon className="icon-instagram" icon={faInstagram} /></a></li>
                            <li><a href="/">
                                <FontAwesomeIcon className="icon-facebook" icon={faFacebook} /></a></li>
                            <li><a href="/">
                                <FontAwesomeIcon className="icon-pinterest" icon={faPinterest} /></a></li>
                        </ul>
                    </Col>
                </Row>

                <Row>
                    <Col xs='7' className='offset-1'>
                        <p><small>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, fuga. Ex at maxime eum odio quibusdam pariatur expedita explicabo harum! Consectetur ducimus delectus nemo, totam odit!</small></p>
                    </Col>
                </Row>
            </Container>

        </footer >
    )
}

export default Footer

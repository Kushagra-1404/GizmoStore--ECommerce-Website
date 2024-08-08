import React, { useState } from 'react'
import {Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "./signup.css";
import { useSignupMutation } from "../services/appApi";


function Signup() {
    const [email, setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name, setName] = useState("");
    const [signup, { error, isLoading, isError }] = useSignupMutation();
    //giving a signup function and some states

    function handleSignup(e) {
        //to avoid form from submitting itself
        e.preventDefault();
        signup({ name, email, password });
    }
  return (
    <Container>
        <Row>
            <Col md={6} className="login__form--container">
                <Form style={{ width:"100%"}} onSubmit={handleSignup}>
                    <h1>Create an account</h1>
                    {isError && <Alert variant="danger">{error.data}</Alert>}
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Your name" value={name} required onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter mail" value={email} required onChange={(e)=> setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" value={password} required onChange={(e)=> setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        {/* button will be disabled while we are signing up because we don't want the user to signup twice*/}
                        <Button type="submit" disabled={isLoading}>Create account</Button>
                    </Form.Group>
                    <p className="pt-3 text-center">Already have an account? <Link to="/login">Login</Link></p>
                </Form>
            </Col>
            <Col md={6} className="signup__image--container"></Col>
        </Row>
    </Container>
  )
}

export default Signup
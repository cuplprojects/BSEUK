import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function Login() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/Login`, formData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/mainpage');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login. Please try again.');
      console.error('Login failed:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row className="min-vh-100 align-items-center justify-content-center">
        <Col xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="userName">
                  <Form.Label className="fw-semibold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="py-2"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="py-2"
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 mb-3 text-uppercase fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="text-center">
                  <small className="text-muted">
                    Don't have an account? <a href="/register" className="text-primary text-decoration-none">Sign up</a>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;

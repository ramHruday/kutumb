import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LoginForm(props) {
  return (
    <Row className="justify-content-center">
      <Col xs={12} md={4} className="card shadow p-3">
        <h3 className="text-dark mb-4">Login</h3>
        <Form className="py-2">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={props.onEmailChange}
              value={props.email}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formBasicPassword"
            onChange={props.onPassWordChange}
            value={props.password}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={props.onSubmit}>
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default LoginForm;

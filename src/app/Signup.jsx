import React, { Component } from "react";
import { Button, Form, Row, Col, Container, Image } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { UserContext } from "./contexts/user.context";
import logo from './../logo.png';

class Signup extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
        geburtstag: "",
        geschlecht: "",
        straße: "",
        hausnummer: "",
        stadt: "",
        postleitzahl: "",
        vorname: "",
        nachname: "",
        telefonnummer: ""
      }
    };
  }

  onFormInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { emailPasswordSignup } = this.context;
    const { form } = this.state;
    const { history } = this.props;
    
    try {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      await emailPasswordSignup(form.email, form.password);
      history.push("/login");
    } catch (error) {
      alert("Failed to signup. Please try again.");
    }
  };

  render() {
    const { form } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Container fluid="md">
          <Form
            style={{
              maxWidth: "1000px",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onSubmit={this.onSubmit}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginTop: "1rem" }}>
              <Image 
                src={logo} 
                alt="Logo"
                style={{
                  width: "70px",
                  height: "70px",
                }}
              />
              <h1 style={{ marginLeft: "1.5rem" }}>Jetzt registrieren</h1>
            </div>
            <Row className="g-5">
              <Col xs={12} md={6}>
                <Form.Group controlId="email" className="form-group-spaced">
                  <Form.Label>E-mail*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password" className="form-group-spaced">
                  <Form.Label>Passwort*</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="form-group-spaced">
                  <Form.Label>Passwort bestätigen*</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="vorname" className="form-group-spaced">
                  <Form.Label>Vorname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="vorname"
                    value={form.vorname}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="nachname" className="form-group-spaced">
                  <Form.Label>Nachname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nachname"
                    value={form.nachname}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="geburtstag" className="form-group-spaced">
                  <Form.Label>Geburtstag*</Form.Label>
                  <Form.Control
                    type="date"
                    name="geburtstag"
                    value={form.geburtstag}
                    onChange={this.onFormInputChange}
                    required
                  />  
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="geschlecht" className="form-group-spaced">
                  <Form.Label>Anrede*</Form.Label>
                  <Form.Select
                    name="geschlecht"
                    value={form.geschlecht}
                    onChange={this.onFormInputChange}
                    required
                  >
                    <option value="">Auswählen...</option>
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                    <option value="Divers">Divers</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="telefonnummer" className="form-group-spaced">
                  <Form.Label>Telefonnummer*</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefonnummer"
                    value={form.telefonnummer}
                    onChange={this.onFormInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="straße" className="form-group-spaced">
                  <Form.Label>Straße</Form.Label>
                  <Form.Control
                    type="text"
                    name="straße"
                    value={form.straße}
                    onChange={this.onFormInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="hausnummer" className="form-group-spaced">
                  <Form.Label>Hausnummer</Form.Label>
                  <Form.Control
                    type="text"
                    name="hausnummer"
                    value={form.hausnummer}
                    onChange={this.onFormInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="stadt" className="form-group-spaced">
                  <Form.Label>Stadt</Form.Label>
                  <Form.Control
                    type="text"
                    name="stadt"
                    value={form.stadt}
                    onChange={this.onFormInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="postleitzahl" className="form-group-spaced">
                  <Form.Label>Postleitzahl</Form.Label>
                  <Form.Control
                    type="text"
                    name="postleitzahl"
                    value={form.postleitzahl}
                    onChange={this.onFormInputChange}
                    pattern="\d{5}"
                    title="Keine gültige Postleitzahl"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="success" type="submit">
              Jetzt registrieren
            </Button>
            <p>
              Die mit * gekennzeichneten Felder sind Pflichtfelder. <br />
              Haben Sie bereits einen Account? <Link to="/login">Login</Link>
            </p>
          </Form>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            &copy; {new Date().getFullYear()} OrganizeIT - FLUXC Applications UG
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(Signup);

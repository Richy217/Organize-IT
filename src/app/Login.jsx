import React, { Component } from "react";
import { Button, Form, Image, Container } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { UserContext, UserProvider } from "./contexts/user.context";
import logo from './../logo.png';
import '@khmyznikov/pwa-install';

class Login extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        password: ""
      }
    };
  }

  componentDidMount() {
    this.loadUser();
  }

  onFormInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ form: { ...this.state.form, [name]: value } });
  };

  redirectNow = () => {
    const { location, history } = this.props;
    const redirectTo = location.search.replace("?redirectTo=", "");
    history.push(redirectTo ? redirectTo : "/home");
  };

  loadUser = async () => {
    const { user, fetchUser } = this.context;
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        this.redirectNow();
      }
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { emailPasswordLogin } = this.context;
    const { form } = this.state;
    try {
      const user = await emailPasswordLogin(form.email, form.password);
      if (user) {
        this.redirectNow();
      }
    } catch (error) {
      if (error.statusCode === 401) {
        alert("Invalid username/password. Try again!");
      } else {
        alert(error);
      }
    }
  };

  render() {
    const { form } = this.state;

    return (
      <>
        <pwa-install></pwa-install>
        <UserProvider>
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
                  maxWidth: "400px",
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
                      width: "60px",
                      height: "60px",
                    }}
                  />
                  <h1 style={{marginLeft:"1.5rem"}}>Login</h1>
                </div>
                <Form.Group controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={this.onFormInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Passwort</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={this.onFormInputChange}
                  />
                </Form.Group>
                <Button variant="success" type="submit">
                  Login
                </Button>
                <p>
                  Haben Sie noch keinen Account? <Link to="/signup">Jetzt registrieren</Link>
                </p>
              </Form>
              <div style={{ textAlign: 'center', padding: '0.5rem'}}>
                &copy; {new Date().getFullYear()} OrganizeIT - FLUXC Applications UG
              </div>
            </Container>
          </div>
        </UserProvider>
      </>
    );
  }
}

export default withRouter(Login);

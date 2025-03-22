
import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import { Container } from "react-bootstrap";
import NavbarComponent from './files/NavbarComponent';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
    };
  }

  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab } = this.state;

    return (
      // Breakpoints von Bootstrap für responsive Design aktuell noch nicht genutzt
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <div>
          {/* Den Navbar Component einfügen, der inty ist hardcoded aber sollte so absolut genügen
          activeTab verstehe ich nicht xD */}
          <NavbarComponent setActiveTab={this.setActiveTab} activeTab={activeTab} inty={2} />

          {/* Aktive Tabellen werden hier gelisted */}
          <Container fluid>
            <div className="row" style={{ marginTop: '5rem' }}>
              <div className="col">
                {/* Hier könnten weitere Inhalte eingefügt werden */}
              </div>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default Statistic;


import "bootstrap/dist/css/bootstrap.css";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import ControlledTabsExample from './functions/tabs';
import { Container} from "react-bootstrap";
import NavbarComponent from './files/NavbarComponent';
import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      activeTab: null,
    };
  }

  componentDidMount() {
    const savedScrollPosition = localStorage.getItem('scrollPositionHome');
    if (savedScrollPosition !== null) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }
    window.addEventListener('scroll', this.handleScroll);
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollPosition = window.scrollY;
    this.setState({ scrollPosition });
    localStorage.setItem('scrollPositionHome', scrollPosition.toString());
  };

  setActiveTab = (key) => {
    this.setState({ activeTab: key });
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { activeTab } = this.state;

    return (
      // Breakpoints von Bootstrap für responsive Design aktuell noch nicht genutzt
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <div className='home-div'>
          <NavbarComponent setActiveTab={this.setActiveTab} activeTab={activeTab} inty={0} />

          {/* Aktive Tabellen werden hier gelisted */}
          <Container fluid>
            {/* Diese leere Div sorgt dafür das die Tabs nach oben hin nicht verschwinden, sollte noch geändert werden */}
            <div className="row" style={{ paddingTop: '5rem' }}>
              <div className="col"></div>
            </div>
            <div className="table-responsive">
              <ControlledTabsExample setter={this.setActiveTab} getter={activeTab} />
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default Home;

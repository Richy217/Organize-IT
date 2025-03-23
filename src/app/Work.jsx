import React, { Component } from 'react';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import NavbarComponent from './files/NavbarComponent';
import ControlledTabsExample from './functions/tabsCards';
import { Container } from "react-bootstrap";

class Work extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      activeTab: null,
      searchTerm: ''
    };
  }

  componentDidMount() {
    const savedScrollPosition = localStorage.getItem('scrollPositionWork');
    if (savedScrollPosition !== null) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollPosition = window.scrollY;
    this.setState({ scrollPosition });
    localStorage.setItem('scrollPositionWork', scrollPosition.toString());
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  setActiveTab = (key) => {
    this.setState({ activeTab: key });
  };

  render() {
    const { searchTerm, activeTab } = this.state;

    return (
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <Container fluid >
        <div className="table-responsive">
          <ControlledTabsExample
            setter={this.setActiveTab}
            getter={activeTab}
            searchTerm={searchTerm} 
          />
        </div>
      </Container>
        <NavbarComponent setActiveTab={this.setActiveTab} activeTab={activeTab} inty={1} />
      </ThemeProvider>
    );
  }
}

export default Work;



import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BuildIcon from '@mui/icons-material/Build';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';

// Farbe aus dem CSS holen
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--bottom-tab-bar-color');
const iconColor = getComputedStyle(root).getPropertyValue('--bottom-tab-bar-icons');

const TabBarButton = styled(BottomNavigationAction)({
  color: iconColor,
  backgroundColor: primaryColor,
  '&.Mui-selected': {
    color: 'navyblue',
  },
});

class BottomTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.inty,
    };
  }

  componentDidMount() {
    this.setState({ activeTab: this.props.inty });
  }

  handleTabChange = (event, newValue) => {
    this.setState({ activeTab: newValue });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <BottomNavigation
        showLabels
        className="bottom-tab-bar"
        value={activeTab}
        onChange={this.handleTabChange}
        style={{ backgroundColor: primaryColor, paddingBottom: '1.2rem', paddingTop: '1.2rem' }}
      >
        <TabBarButton component={RouterLink} to="/home" label="Tabelle" icon={<HomeIcon />} />
        <TabBarButton component={RouterLink} to="/work" label="Checkliste" icon={<BuildIcon />} />
        <TabBarButton component={RouterLink} to="/statistic" label="Statistik" icon={<TrendingUpIcon />} />
        <TabBarButton component={RouterLink} to="/account" label="Profil" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    );
  }
}

export default BottomTabBar;

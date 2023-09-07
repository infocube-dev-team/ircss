import React from 'react';
import { Link } from 'react-router-dom';
import './logo.css'

class Logo extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">
          <img alt='Pascale img' src="./LogoPascale.png" className="responsive-image"></img>
        </Link>
      </div>
    );
  }
}

export default Logo;

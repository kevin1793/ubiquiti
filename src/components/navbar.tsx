import "./../components/navbar.css";
import logo from "./../assets/images/logo.png";

function Navbar(){


  return (
    <div id="navbarWrapper">
      <div id="navbarCont">
        <img src={logo}></img><div id="title">Devices</div><div id="devName">Kevin Claveria</div>
      </div>
    </div>
  )
}

export default Navbar;
import "./../components/optionbar.css";
import logo from "./../assets/images/logo.png";

function Optionbar(){


  return (
    <div id="optionbarWrapper">
      <div id="optionbarCont">
        <img src={logo}></img><div id="title">Devices</div><div id="devName">Kevin Claveria</div>
      </div>
    </div>
  )
}

export default Optionbar;
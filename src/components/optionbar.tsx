import React, { useEffect,useState } from "react";
import "./../components/optionbar.css";
import listView from "./../assets/images/List_View.png";
import gridView from "./../assets/images/Grid_View.png";

interface OptionbarProps {
  toOption: (message: object) => void;
}

function Optionbar({toOption}: OptionbarProps){
  const [devices, setDevices] = useState([]);
  const [view, setView] = useState('');
  useEffect(() =>{
    if(!devices.length){
      var data = localStorage.getItem('data');
      var parsedData = data?JSON.parse(data):'';
      console.log('parsed data',parsedData);
      setDevices(parsedData); 
    }
  });

  const sendMessageToParent = (x:any) => {
    toOption(x);
  };

  function viewChanged(x:any){
    console.log('gridViewClicked');
    localStorage.setItem('view',x);
    setView(x);
    sendMessageToParent({view:x});
  }
  return (
    <div id="optionbarWrapper">
      <div id="optionbarCont">
        <div className="optionLeft"> 
        
        <span className='search-bar'>
            <i className="fa fa-search searchIcon" aria-hidden="true"></i>
            <input  type="text" placeholder="Search"></input>
        </span><div className="deviceCount">{devices.length} Devices</div></div>
        <div className="optionRight"><img src={listView} onClick={e => viewChanged('list')}></img><img src={gridView}  onClick={e => viewChanged('tile')}></img><div className="filterText">Filter</div></div>
      </div>
    </div>
  )
}

export default Optionbar;
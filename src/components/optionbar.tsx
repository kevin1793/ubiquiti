import React, { useEffect,useState } from "react";
import "./../components/optionbar.css";
import listView from "./../assets/images/List_View.png";
import gridView from "./../assets/images/Grid_View.png";
import listViewSelected from "./../assets/images/List_View_Selected.png";
import gridViewSelected from "./../assets/images/Grid_View_Selected.png";

interface OptionbarProps {
  toOption: (message: object) => void;
}

function Optionbar({toOption}: OptionbarProps){
  const [devices, setDevices] = useState([]);
  const [view, setView] = useState('');
  useEffect(() =>{
    console.log('optionbar view',view);
    if(!devices.length){
      setTimeout(function(){
        getLocalData();
      },1000);
    }
    if(view == ''){
      console.log(view);
      var localView = localStorage.getItem('view');
      setView(localView?localView:'list');
    }
  });

  function getLocalData(){
    var data = localStorage.getItem('data');
    var parsedData = data?JSON.parse(data):'';
    console.log('parsed data',parsedData);
    setDevices(parsedData); 
  }

  const sendMessageToParent = (x:any) => {
    localStorage.setItem('view',x);
    toOption(x);
  };

  function viewChanged(x:any){
    console.log('gridViewClicked');
    localStorage.setItem('view',x);
    setView(x);
    sendMessageToParent({view:x});
  }
  function searchChanged(e:any){
    var val = e.target.value;
    toOption({search:val});
  }
  return (
    <div id="optionbarWrapper">
      <div id="optionbarCont">
        <div className="optionLeft"> 
          <span className='search-bar'>
              <i className="fa fa-search searchIcon" aria-hidden="true"></i>
              <input onChange={e=> searchChanged(e)} type="text" placeholder="Search"></input>
          </span><div className="deviceCount">{devices.length} Devices</div></div>
          <div className="optionRight">
            <button><img src={view == 'list'?listViewSelected:listView} onClick={e => viewChanged('list')}></img></button>
            <button><img src={view == 'tile'?gridViewSelected:gridView}  onClick={e => viewChanged('tile')}></img></button>
            <div className="filterText">Filter</div>
          </div>
      </div>
    </div>
  )
}

export default Optionbar;
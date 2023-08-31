import React, { useEffect,useState } from "react";
import "./../components/tilegrid.css";

interface tileGridProps {
  toTile: (message: object) => void;
}

function Tilegrid({toTile}: tileGridProps){
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    // call api or anything
    console.log('DATA?',localStorage.getItem('data'))
    if(!devices.length){
      console.log("loaded");
      loadData();
    }else{
      console.log('devices',devices);
      console.log('devices local',localStorage.getItem('data'))
    } 
  });
  const sendMessageToParent = (x:any) => {
    toTile(x); // Use the appropriate value here
    console.log(x);
  };

  async function loadData(){
    var data = localStorage.getItem('data');
    var parsedData = data?JSON.parse(data):'';
    console.log('parsed data',parsedData);
    setDevices(parsedData); 
  }
  function recordClicked(device:any){
    sendMessageToParent({record:device});
  }
  return (
    <div id="tileGridWrapper">
      <div id="tileGridCont">
      {
        devices.length?
        devices.map((device:any) =>(
          <div className="tileBox" onClick={e=>recordClicked(device)}>
            <div className="tileBoxTop">
              <div className="tileBadge">{device.line.name}</div>
              <img src={'https://static.ui.com/fingerprint/ui/icons/'+(device?.icon?device.icon.id:'')+'_'+(device?.icon?.resolutions?device.icon?.resolutions[3][0]:'')+'x'+(device?.icon?.resolutions?device.icon?.resolutions[3][1]:'')+'.png'}></img>
            </div>
            <div className="tileBoxBottom">
              <div className="productName">{device.product.name?device.product.name:'-'}</div>
              <div className="shortnameBox">
                <span className="shortnames">{device.shortnames[0]}</span>
              </div>
            </div>
          </div>
        ))
        :
        'NONE'
        }
      </div>
    </div>
  )
}

export default Tilegrid;
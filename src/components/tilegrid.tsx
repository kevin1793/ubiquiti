import React, { useEffect,useState } from "react";
import "./../components/tilegrid.css";

interface tileGridProps {
  toTile: (message: object) => void;
}

function Tilegrid({toTile}: tileGridProps){
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    console.log('TILEGRID');
    // call api or anything
    console.log('TILE GRID DATA?',localStorage.getItem('data'));
    var localSearch = localStorage.getItem('search');

    if(localSearch?.length){
      setSearch(localSearch?localSearch:'');
    }
    if(allDevices.length && localStorage.getItem('search') != search){

      if(localSearch == ''){
        setDevices(allDevices);
        setSearch(localSearch?localSearch:'');
        return;
      }
      var filteredDevices:any = allDevices.filter((x:any) => (x.product?.name).toLowerCase().includes(localSearch));
      setDevices(filteredDevices.length?filteredDevices:[]);
      setSearch(localSearch?localSearch:'');
      console.log('devices length',devices.length);
    }
    if(!allDevices.length){
      console.log("loaded");
      loadData();
    }
  });
  const sendMessageToParent = (x:any) => {
    toTile(x); // Use the appropriate value here
    console.log(x);
  };

  async function loadData(){
    if(!localStorage.getItem('data')){
      fetchData();
    }else{
      var data = localStorage.getItem('data');
      var parsedData = data?JSON.parse(data):'';
      setDevices(parsedData);
      setAllDevices(parsedData);
    }
  }
  function recordClicked(device:any){
    const isEle = (element:any) => element == device;
    var idx = allDevices.findIndex(isEle);
    sendMessageToParent({record:device,index:idx});
  }
  async function fetchData(){
    console.log('LOAD DATA APP');
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    console.log(res);
    localStorage.setItem('data',JSON.stringify(res.devices));
    setDevices(res.devices);
    setAllDevices(res.devices);
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
      <div className="noneFoundText">No Devices Found</div>
      }
      </div>
    </div>
  )
}

export default Tilegrid;
import React, { useEffect,useState } from "react";
import "./../components/tilegrid.css";
import { parse } from "path";

interface tileGridProps {
  toTile: (message: object) => void;
}

function Tilegrid({toTile}: tileGridProps){
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [init,setInit] = useState('');
  useEffect(() => {
    var localSearch:any = localStorage.getItem('search');
    var localFilter:any = localStorage.getItem('selectedProductFilter');
    var localViewChanged:any = localStorage.getItem('viewChanged');
    var parsedFilter = JSON.parse(localFilter);
    if(!allDevices.length){
      fetchData();
    }
    if(allDevices.length && localViewChanged == 'Y'){
      localStorage.setItem('viewChanged','N');
      filterData(allDevices,localSearch,parsedFilter);
    }
    // SEACHCHANGED
    if(localSearch != search){
      if(!localSearch?.length){
        setFilteredDevices(allDevices);
      }
      setSearch(localSearch);
      filterData(filteredDevices,localSearch,selectedFilter);
    }
    // FILTERCHANGED
    if((parsedFilter && parsedFilter.length == 0 && selectedFilter.length != parsedFilter.length && selectedFilter && parsedFilter) || (selectedFilter && parsedFilter && selectedFilter.length != parsedFilter.length)){
      setSelectedFilter(parsedFilter);
      filterData(allDevices,search,parsedFilter);
    }
    
  });
  function getFilteredDevices(parsedFilter:any){
    var filteredDevicesByProducts:any = allDevices;
    if(parsedFilter?.length){
      filteredDevicesByProducts = allDevices.filter((x:any) => parsedFilter.includes(x.line.name));
    }
    setFilteredDevices(filteredDevicesByProducts);

    filterData(filteredDevicesByProducts,search,parsedFilter);
  }
  function filterData(arr:any,val:any ,filter:any){
    var filteredDevices = allDevices;
    if(filter?.length){
      filteredDevices = allDevices.filter((x:any) => filter.includes(x.line.name));
    }
    var searchedDevices = filteredDevices;
    if(val?.length){
      searchedDevices = searchedDevices.filter((x:any) => (x.product?.name).toLowerCase().includes(val));
    }
    setDevices(searchedDevices);
  }
  const sendMessageToParent = (x:any) => {
    toTile(x); // Use the appropriate value here
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
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
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
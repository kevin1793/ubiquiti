import React, { useEffect,useState } from "react";
import "./../components/listgrid.css"

interface listGridProps {
  toList: (message: object) => void;
  updateList: (message: object) => void;

}


function Listgrid({toList,updateList}: listGridProps){
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    var localSearch:any = localStorage.getItem('search');
    console.log('===LISRTTGRID======================================');
    var localFilter:any = localStorage.getItem('selectedProductFilter');
    var parsedFilter = JSON.parse(localFilter);
    console.log('SEARCH',search,localSearch);
    
    // console.log('PARSED FILTER',parsedFilter);
    console.log('alllDevices',allDevices.length);
    if(!allDevices.length){
      console.log("loaded");
      fetchData();
    }
    // SEACHCHANGED
    if(localSearch != search){
      if(!localSearch.length){
        setFilteredDevices(allDevices);
      }
      console.log('localSearch',localSearch);
      console.log('search',search);
      setSearch(localSearch);
      filterData(filteredDevices,localSearch);
    }
    // FILTERCHANGED
    if(selectedFilter.length != parsedFilter.length){
      setSelectedFilter(parsedFilter);
      console.log('FILTERCHANGED',parsedFilter,selectedFilter);
      getFilteredDevices(parsedFilter);
    }
  });

  function getFilteredDevices(parsedFilter:any){
    var filteredDevicesByProducts:any = allDevices;
    if(parsedFilter?.length){
      console.log('parsedFilter.length');
      filteredDevicesByProducts = allDevices.filter((x:any) => parsedFilter.includes(x.line.name));
    }
    setFilteredDevices(filteredDevicesByProducts);
    filterData(filteredDevicesByProducts,search);
  }

  function filterData(arr:any,val:any){
    var parsedData:any = selectedFilter;
    if(!val?.length){
      console.log('filterData')
      console.log('SET DEVICES localSearch',devices,filteredDevices);
      
      // var filteredDevicesByProducts = allDevices.filter((x:any) => parsedData.includes(x.line.name));
      setDevices(arr);
      return;
    }
    var filteredDevicesByProducts = allDevices.filter((x:any) => parsedData.includes(x.line.name));
    var filteredDevs:any = filteredDevicesByProducts.filter((x:any) => (x.product?.name).toLowerCase().includes(val));
    console.log(filteredDevs.length);
    setDevices(filteredDevs.length?filteredDevs:[]);
  }

  function recordClicked(x:any){
    const isEle = (element:any) => element == x;
    var idx = allDevices.findIndex(isEle);
    sendMessageToParent({record:x,index:idx});
  }

  const sendMessageToParent = (x:any) => {
    toList(x); // Use the appropriate value here
    console.log(x);
  };

  async function fetchData(){
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    localStorage.setItem('data',JSON.stringify(res.devices));
    setDevices(res.devices);
    setAllDevices(res.devices);
  }
  return (
    <div id="listgridWrapper">
      <div id="listgridCont">
      {
          devices.length?
        <table>
          <tr>
            <th  className="imgtd"></th>
            <th className="linetd">Product Line</th>
            <th className="linetd">Name</th>
          </tr>
          {
          devices.map((device:any) =>(
            <tr className="deviceRecord" onClick={e => recordClicked(device)}>
              <td className="imgtd"><img src={'https://static.ui.com/fingerprint/ui/icons/'+(device?.icon?device.icon.id:'')+'_'+(device?.icon?.resolutions?device.icon?.resolutions[0][0]:'')+'x'+(device?.icon?.resolutions?device.icon?.resolutions[0][1]:'')+'.png'}></img></td>
              
              <td  className="linetd"><div className="recordLine">{device.line.name?device.line.name:'-'}</div></td>
              <td className="linetd"><div className="recordName">{device.product.name?device.product.name:'-'}</div> </td>
            </tr>
          ))
          }
        </table>

          :
          <div className="noneFoundText">No Devices Found</div>
          }
      </div>
    </div>
  )
}

export default Listgrid;
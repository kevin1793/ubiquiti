import React, { useEffect,useState } from "react";
import "./../components/listgrid.css"
import { parse } from "path";

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
    var localFilter:any = localStorage.getItem('selectedProductFilter');
    var parsedFilter = JSON.parse(localFilter);
    var localViewChanged:any = localStorage.getItem('viewChanged');

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
      filterData(filteredDevices,localSearch,parsedFilter);
    }
    // FILTERCHANGED
    if((parsedFilter && parsedFilter.length == 0 && selectedFilter.length != parsedFilter.length && selectedFilter && parsedFilter) || (selectedFilter && parsedFilter && selectedFilter.length != parsedFilter.length)){
      setSelectedFilter(parsedFilter);
      // getFilteredDevices(parsedFilter);
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

  function recordClicked(x:any){
    const isEle = (element:any) => element == x;
    var idx = allDevices.findIndex(isEle);
    sendMessageToParent({record:x,index:idx});
  }

  const sendMessageToParent = (x:any) => {
    toList(x); // Use the appropriate value here
  };

  async function fetchData(){
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    localStorage.setItem('data',JSON.stringify(res.devices));
    // if(localStorage.getItem('viewChanged') == 'N'){
      setDevices(res.devices);
    // }
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
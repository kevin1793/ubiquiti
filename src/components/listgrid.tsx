import React, { useEffect,useState } from "react";
import "./../components/listgrid.css"

interface listGridProps {
  toList: (message: object) => void;
  updateList: (message: object) => void;

}


function Listgrid({toList,updateList}: listGridProps){
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    console.log('START LISTGRID');
    // call api or anything
    console.log('updateList LIST',JSON.stringify(search));
    console.log('local search',JSON.stringify(localStorage.getItem('search')));
    if(localStorage.getItem('search') != search){
      var localSearch = localStorage.getItem('search');

      if(localSearch === ''){
        setDevices(allDevices);
        setSearch(localSearch?localSearch:'');
        return;
      }
      console.log('search',localStorage.getItem('search'));
      setAllDevices(devices);
      var filteredDevices:any = allDevices.filter((x:any) => (x.product?.name).toLowerCase().includes(localSearch));
      setDevices(filteredDevices?filteredDevices:[]);
      setSearch(localSearch?localSearch:'');
      console.log('devices length',devices.length);
    }
    if(!devices.length){
      console.log("loaded");
      loadData();
    }
  });

  function recordClicked(x:any){
    sendMessageToParent({record:x});
  }

  const sendMessageToParent = (x:any) => {
    toList(x); // Use the appropriate value here
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
    <div id="listgridWrapper">
      <div id="listgridCont">
        <table>
          <tr>
            <th  className="imgtd"></th>
            <th className="linetd">Product Line</th>
            <th className="linetd">Name</th>
          </tr>
          {
          devices.length?
          devices.map((device:any) =>(
            <tr className="deviceRecord" onClick={e => recordClicked(device)}>
              <td className="imgtd"><img src={'https://static.ui.com/fingerprint/ui/icons/'+(device?.icon?device.icon.id:'')+'_'+(device?.icon?.resolutions?device.icon?.resolutions[0][0]:'')+'x'+(device?.icon?.resolutions?device.icon?.resolutions[0][1]:'')+'.png'}></img></td>
              
              <td  className="linetd"><div className="recordLine">{device.line.name?device.line.name:'-'}</div></td>
              <td className="linetd"><div className="recordName">{device.product.name?device.product.name:'-'}</div> </td>
            </tr>
          ))
          :
          'NONE'
          }
        </table>
        
      </div>
    </div>
  )
}

export default Listgrid;
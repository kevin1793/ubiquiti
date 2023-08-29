import React, { useEffect,useState } from "react";
import "./../components/listgrid.css"

function Listgrid(){
  const [devices, setDevices] = useState([]);
  var devs:any = [];
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

  async function loadData(){
    // var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    // const res = await data.json();
    // console.log(res);
    // localStorage.setItem('data',JSON.stringify(res.devices));
    // var listData = res.devices;
    // devs = listData;
    // console.log(devs);
    var data = localStorage.getItem('data');
    var parsedData = data?JSON.parse(data):'';
    console.log('parsed data',parsedData);
    setDevices(parsedData); 
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
            <tr className="deviceRecord">
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
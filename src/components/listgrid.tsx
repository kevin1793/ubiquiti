import React, { useEffect,useState } from "react";
import "./../components/listgrid.css"

interface listGridProps {
  toList: (message: object) => void;
}

function Listgrid({toList}: listGridProps){
  const [devices, setDevices] = useState([]);
  var devs:any = [];
  useEffect(() => {
    // call api or anything
    if(!devices.length){
      console.log("loaded");
      loadData();
    }else{
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
    var data = localStorage.getItem('data');
    var parsedData = data?JSON.parse(data):'';
    console.log('loading data LISTGRID',parsedData)
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
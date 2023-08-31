import React, { useEffect,useState } from "react";
import "./../components/productview.css";

interface Record{
  id?:any;
  icon?:any;
  product?:any;
  line?:any;
  icons?:any;
  shortnames?:any;
  sysid?:any;
  unifi?:any;
}
function Productview(){
  const [record, setRecord] = useState<Record>({});
  useEffect(() =>{
    if(!record.id){
      var rec = localStorage.getItem('record');
      var parsedRec = rec?JSON.parse(rec):{};
      console.log('parsedRec',parsedRec);
      setRecord(parsedRec);
      console.log(record);
    }
  });

  return (
    <div id="productWrapper">
      <div id="productCont">
        <div className="prodLeft">
          <img src={'https://static.ui.com/fingerprint/ui/icons/'+(record?.icon?record.icon.id:'')+'_'+(record?.icon?.resolutions?record.icon?.resolutions[4][0]:'')+'x'+(record?.icon?.resolutions?record.icon?.resolutions[4][1]:'')+'.png'}></img>

        </div>
        <div className="prodRight">
          <div className="prodTitle">{record?.product?.name}</div>
          <div className="prodSmallText">{record?.line?.name}</div>
          <div className="prodLine">
            <div className="prodLeftText">Product Line</div>
            <div  className="prodRightText">{record?.line?.name}</div>
          </div>
          <div className="prodLine">
            <div className="prodLeftText">ID</div>
            <div className="prodRightText">{record?.sysid}</div>
          </div>
          
          <div className="prodLine">
            <div className="prodLeftText">Name</div>
            <div className="prodRightText">{record?.line?.name}</div>
          </div>

          <div className="prodLine">
            <div className="prodLeftText">Short Name</div>
            <div className="prodRightText">{record?.shortnames?.length?record?.shortnames[0]:''}</div>
          </div>
          <div className="prodLine">
            <div className="prodLeftText">Max Power</div>
            <div className="prodRightText">{record?.unifi?.network?.radios?.na?.maxPower?record.unifi?.network?.radios?.na?.maxPower+' W':'-'}</div>
          </div>
          <div className="prodLine">
            <div className="prodLeftText">Speed</div>
            <div className="prodRightText">{record.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond?record.unifi?.network?.ethernetMaxSpeedMegabitsPerSecond+' Mbps':'-'}</div>
          </div>
          <div className="prodLine">
            <div className="prodLeftText">Number of Ports</div>
            <div className="prodRightText">{record.unifi?.network?.numberOfPorts?record.unifi?.network?.numberOfPorts:'-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Productview;
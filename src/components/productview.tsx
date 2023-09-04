import React, { useEffect,useState } from "react";
import "./../components/productview.css";
import leftArrow from "./../assets/images/ArrowLeftPrimary.png";
import rightArrow from "./../assets/images/ArrowRightPrimary.png";

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

interface ProductviewProps {
  toProduct: (message: object) => void;
}

function Productview({toProduct}: ProductviewProps){
  const [record, setRecord] = useState<Record>({});
  const [allRecords, setAllRecords] = useState([]);
  const [jsonDetails, setJsonDetails] = useState('');
  const[index, setIndex] = useState(-1);
  useEffect(() =>{
    console.log(record);
    console.log(index);
    if(!record.id){
      var rec = localStorage.getItem('record');
      var parsedRec = rec?JSON.parse(rec):{};
      console.log('parsedRec',parsedRec);
      setRecord(parsedRec);
      localStorage.setItem('seeJsonDetails','N');
    }
    if(index == -1){
      var idx = localStorage.getItem('index');
      var parsedIndex = parseInt(idx?idx:'-1');
      setIndex(parsedIndex?parsedIndex:-1);
      console.log('parsedIndex',parsedIndex);
    }
    if(!allRecords.length){
      fetchData();
    }
  });
  async function fetchData(){
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    localStorage.setItem('data',JSON.stringify(res.devices));
    setAllRecords(res.devices);
  }

  function toggleDetails(){
    if(localStorage.getItem('seeJsonDetails') == 'N'){
      localStorage.setItem('seeJsonDetails','Y');
      setJsonDetails(JSON.stringify(record));
    }else{
      localStorage.setItem('seeJsonDetails','N');
      setJsonDetails('');
    }
    console.log("localStorage.getItem('seeJsonDetails')",localStorage.getItem('seeJsonDetails'));
  }
  const sendMessageToParent = (x:any) => {
    toProduct(x); // Use the appropriate value here
    console.log(x);
  };
  function backClicked(){
    var message = {click:'back'};
    sendMessageToParent(message);
  }
  function nextClicked(){
    var newRec:any;
    if(index+1 == allRecords.length){
      newRec = allRecords[0];
    }else{
      var newIdx = index+1;
      newRec = allRecords[newIdx];
    }
    setIndex(index+1);
    setRecord(newRec);
  }

  function previousClicked(){
    var newRec:any;
    if(index-1 == -1){
      newRec = allRecords[0];
    }else{
      newRec = allRecords[index-1];
    }
    setIndex(index-1);
    setRecord(newRec);
  }

  return (
    <div id="productWrapper">
      <div className="prodBarCont">
        <div className="prodBarLeft">
          <div className="button backButton" onClick={e => backClicked()}>
            <img src={leftArrow}></img> <div>Back</div>
          </div>
        </div>
        <div className="prodBarRight">
          <div className="button" onClick={e=> previousClicked()}>
          <img src={leftArrow}></img>
          </div>
          <div className="button" onClick={e=> nextClicked()}>
          <img src={rightArrow}></img>
          </div>
        </div>
      </div>
      <div id="productCont">
        <div className="prodLeft">
          {
            record?.icon?
            <div className="prodImageHolder">
              <img src={'https://static.ui.com/fingerprint/ui/icons/'+(record?.icon?record.icon.id:'')+
            '_'+(record?.icon?.resolutions?record.icon?.resolutions[4][0]:'')+'x'+
            (record?.icon?.resolutions?record.icon?.resolutions[4][1]:'')+'.png'}></img>
            </div>
            :
            <div className="prodPlaceholderImg"></div>
          }

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
          <div className="jsonCont">
            <button onClick={ e=> toggleDetails()}>
              {
                jsonDetails?
                'Collapse Details'
                :
                'See All Details as JSON'
              }
              </button>
            
          </div>
        </div>
        <div className="jsonDetailsCont">
        {
          jsonDetails?
          <p className="jsonDetails">{JSON.stringify(record)}</p>
          :
          ''
        }
        </div>
      </div>
    </div>
  )
}

export default Productview;
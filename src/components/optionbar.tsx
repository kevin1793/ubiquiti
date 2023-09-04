import React, { useEffect,useState } from "react";
import "./../components/optionbar.css";
import listView from "./../assets/images/List_View.png";
import gridView from "./../assets/images/Grid_View.png";
import listViewSelected from "./../assets/images/List_View_Selected.png";
import gridViewSelected from "./../assets/images/Grid_View_Selected.png";

interface OptionbarProps {
  toOption: (message: object) => void;
}

function Optionbar({toOption}: OptionbarProps){
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [view, setView] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [filterToggle, setFilterToggle] = useState('N');
  const [productLines,setProductLines] =  useState([]);
  const [selectedProductLines,setSelectedProductLines] =  useState([]);
  useEffect(() =>{
    if(!allDevices.length){
      setTimeout(function(){
        getLocalData();
      },1000);
    }
    if(view == ''){
      var localView = localStorage.getItem('view');
      setView(localView?localView:'list');
    }
    if(allDevices.length && !productLines.length){
      getProductLines();
    }
  });

  function getLocalData(){
    var data = localStorage.getItem('data');
    var parsedData = data?JSON.parse(data):'';
    setDevices(parsedData); 
    setAllDevices(parsedData);
    setFilteredDevices(parsedData);
  }
  function getProductLines(){
    var prodArr:any = [];
    for(var i =0;i< allDevices.length;i++){
      var rec:any = allDevices[i];
      if(!prodArr.includes(rec.line?.name) ){
        prodArr.push(rec.line?.name);
      }
    } 
    console.log('prodArr',prodArr);
    setProductLines(prodArr);
  }

  const sendMessageToParent = (x:any) => {
    localStorage.setItem('view',x);
    toOption(x);
  };

  function viewChanged(x:any){
    localStorage.setItem('view',x);
    setView(x);
    sendMessageToParent({view:x});
  }
  function searchChanged(e:any){
    var val:any = e.target.value;
    console.log('function searchChanged',val)
    localStorage.setItem('search',val);

    
    setSearchVal(val);
    filterSearchVal(val);
    toOption({search:val});

  }

  function filterSearchVal(val:any){
    console.log(' function filterSearchVal filteredDevices',filteredDevices.length,val);
    if(val.length>0){
      var filteredDevs = filteredDevices.filter((x:any) => x.product.name.toLowerCase().includes(val));
      setDevices(filteredDevs);
      console.log('filterSearchVal',filteredDevs.length)
    }
    if(!val.length){
      var selectedFilter:any = selectedProductLines;
      var filteredDevs = allDevices.filter((x:any) => selectedFilter.includes(x.line?.name));
      setDevices(filteredDevs);
    }
  }
  function toggleFilter(){
    if(filterToggle == 'N'){
      setFilterToggle('Y');
    }else{
      setFilterToggle('N');
    }
  }
  function checkBoxToggled(e:any){
    toOption({search:searchVal});
    console.log(e.target.value);
    var val = e.target.value?e.target.value.toString():'';
    var prodArr:any = selectedProductLines;
    if(val.length && prodArr?.includes(val)){
      console.log('splicing');
      var idx = prodArr.indexOf(val);
      prodArr.splice(idx,1)
      setSelectedProductLines(prodArr);
    }else{
      console.log('adding');
      prodArr.push(val)
      setSelectedProductLines(prodArr);
    }
    localStorage.setItem('selectedProductFilter',JSON.stringify(selectedProductLines));

    if(selectedProductLines.length == 0){
      console.log('none');
      setFilteredDevices(allDevices);
      setDevices(allDevices);
      filterSearchVal(searchVal);
      toOption({filter:[]});
      return;
    }
    console.log('selectedProductLines',selectedProductLines);
    var filteredDevices = allDevices.filter((x:any) => prodArr.includes(x.line?.name));
    setFilteredDevices(filteredDevices);
    filterSearchVal(searchVal);
    setDevices(filteredDevices);
    toOption({filter:selectedProductLines});

  }
  return (
    <div id="optionbarWrapper">
      <div id="optionbarCont">
        <div className="optionLeft"> 
          <span className='search-bar'>
              <i className="fa fa-search searchIcon" aria-hidden="true"></i>
              <input onChange={e=> searchChanged(e)} type="text" placeholder="Search"></input>
          </span><div className="deviceCount">{devices.length} Devices</div></div>
          <div className="optionRight">
            <button><img src={view == 'list'?listViewSelected:listView} onClick={e => viewChanged('list')}></img></button>
            <button><img src={view == 'tile'?gridViewSelected:gridView}  onClick={e => viewChanged('tile')}></img></button>
            <div id="filterCont">
              <button className="filterText" onClick={e=> toggleFilter()}>Filter</button>
              {filterToggle == 'Y'?
              <div id="filterDropBox">
                <div className="filterDropBoxTitle">Product line</div>
                {
                  productLines.length?
                  productLines.map((prod:any) =>(
                  <label className="dropdown-option">
                  <input type="checkbox" name="dropdown-group" value={prod} onChange={e=> checkBoxToggled(e)} />
                    {prod}
                  </label>
                  ))
                  :
                  ''
                }
                <div className="filterDropBoxReset">Reset</div>
              </div>
              :
              ''
              }
            </div>
          </div>
      </div>
    </div>
  )
}

export default Optionbar;
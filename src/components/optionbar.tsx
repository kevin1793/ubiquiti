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
    var localFilter:any = localStorage.getItem('selectedProductFilter');
    var parsedFilter = JSON.parse(localFilter);
    if(!allDevices.length){
      setTimeout(function(){
        getLocalData();
      },500);
    }
    if(view == ''){
      var localView = localStorage.getItem('view');
      setView(localView?localView:'list');
    }
    if(allDevices.length && !productLines.length){
      getProductLines();
    }

    if((selectedProductLines && parsedFilter && selectedProductLines.length != parsedFilter.length)){
      setSelectedProductLines(parsedFilter);
      setFilteredDevices(parsedFilter);
      filterSearchVal(allDevices,searchVal,parsedFilter);
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
    setProductLines(prodArr);
  }

  const sendMessageToParent = (x:any) => {
    localStorage.setItem('view',x);
    toOption(x);
  };

  function viewChanged(x:any){
    filterSearchVal(allDevices,searchVal,selectedProductLines);
    localStorage.setItem('view',x);
    localStorage.setItem('viewChanged','Y');
    setView(x);
    sendMessageToParent({view:x});
  }
  function searchChanged(e:any){
    var val:any = e.target.value;
    localStorage.setItem('search',val);

    
    setSearchVal(val);
    filterSearchVal(filteredDevices,val,selectedProductLines);
    toOption({search:val});

  }

  function filterSearchVal(arr:any,val:any,selectedProductsFilter:any){
    var filteredDevs;
    var filteredDevicesByProducts = allDevices;

    if(!val.length){
      if(selectedProductsFilter.length){
        filteredDevicesByProducts = allDevices.filter((x:any) => selectedProductsFilter.includes(x.line.name));
      }
      setDevices(filteredDevicesByProducts);
      return;
    }else{
      if(selectedProductsFilter.length){
        filteredDevicesByProducts = allDevices.filter((x:any) => selectedProductsFilter.includes(x.line.name));
      }
      var filteredDevs:any = filteredDevicesByProducts.filter((x:any) => (x.product?.name).toLowerCase().includes(val));
      setDevices(filteredDevs);
    }
  }
  function setFilterBoxes(){
    var prods: any = selectedProductLines;
    var checkBoxes:any = window.document.getElementsByClassName('filterCheckBoxes');
    for(var i =0;i<checkBoxes.length;i++){
      var val:string = checkBoxes[i].value?checkBoxes[i].value:'false';
      if(prods.length && prods.includes(val)){
        checkBoxes[i].checked = true;
      }
    }
  }
  function toggleFilter(){
    if(filterToggle == 'N'){
      setFilterToggle('Y');
      setTimeout(function(){
        setFilterBoxes()
      },100);
    }else{
      setFilterToggle('N');
    }
    
  }
  function resetFilters(){
    localStorage.setItem('selectedProductFilter',JSON.stringify([]));
    var prodArr:any = [];
    setSelectedProductLines(prodArr);
    setFilteredDevices(allDevices);
    var checkBoxes:any = window.document.getElementsByClassName('filterCheckBoxes');
    for(var i =0;i<checkBoxes.length;i++){
      checkBoxes[i].checked = false;
    }
    setDevices(allDevices);

    filterSearchVal(allDevices,searchVal,[]);
    toOption({filter:prodArr});
    toOption({search:searchVal});
  }
  function checkBoxToggled(e:any){
    toOption({search:searchVal});
    var val = e.target.value?e.target.value.toString():'';
    var prodArr:any = selectedProductLines;
    if(val.length && prodArr?.includes(val)){
      var idx = prodArr.indexOf(val);
      prodArr.splice(idx,1)
      setSelectedProductLines(prodArr);
    }else{
      prodArr.push(val)
      setSelectedProductLines(prodArr);
    }
    localStorage.setItem('selectedProductFilter',JSON.stringify(prodArr));

    if(prodArr.length == 0){
      setFilteredDevices(allDevices);
      setDevices(allDevices);
      filterSearchVal(allDevices,searchVal,prodArr);
      toOption({filter:[]});
      return;
    }
    var filteredDevices = allDevices.filter((x:any) => prodArr.includes(x.line?.name));
    setFilteredDevices(filteredDevices);
    filterSearchVal(filteredDevices,searchVal,prodArr);
    toOption({filter:prodArr});
  }
  return (
    <div id="optionbarWrapper">
      <div id="optionbarCont">
        <div className="optionLeft"> 
          <span className='search-bar'>
              <i className="fa fa-search searchIcon" aria-hidden="true"></i>
              <input id="deviceSearch" onChange={e=> searchChanged(e)} type="text" placeholder="Search"></input>
          </span>
          <div className="deviceCount">
            {
              allDevices.length?
              devices.length+ ' Devices'
              :

              'Loading...'
            }
          </div>
        </div>
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
                <input type="checkbox" className="filterCheckBoxes" name="dropdown-group" value={prod} onChange={e=> checkBoxToggled(e)} />
                  {prod}
                </label>
                ))
                :
                ''
              }
              {
                selectedProductLines.length?
                <div className="filterDropBoxReset" onClick={e=>{resetFilters()}}>Reset</div>
                :
                <div className="filterDropBoxReset disabled">Reset</div>
              }
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
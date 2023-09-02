import React , { useState, useEffect, Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Navbar from './components/navbar';
import Optionbar from './components/optionbar';
import Listgrid from './components/listgrid';
import Tilegrid from './components/tilegrid';
import Productview from './components/productview';

interface Record {
  line?: object;
  product?:string;
  shortnames?:string;
}

function App() {
  const [tileUpdate, updateFromTile] = useState<string>('');
  const [view, setView] = useState<string>('list');
  const [record, setRecord] = useState<Record>({line:{}});
  const [lastView, setLastView] = useState<string>('list');
  const [searchValue, setSearchValue] = useState<string>('list');
  const [listData, setListData] = useState('');

  useEffect(() => {
    console.log("loaded");
    console.log(localStorage.getItem('view'));
    loadData();

    console.log('APP view',view);
    if(localStorage.getItem('view')){
      var localView = localStorage.getItem('view')?localStorage.getItem('view'):'';
      setView(localView?localView:'');
      if(localView == 'product' && !record.product){
        var localRecord = localStorage.getItem('record');
        var parsedRecord = localRecord?JSON.parse(localRecord):{};
        setRecord(parsedRecord);
      }else{
        console.log('WE HAVE RECORD',record);
      }
    }
  });

  const fromOption = (message:any) => {
    console.log('MESSAGE FROM OPTION',message);
    if(message.view){
      localStorage.setItem('view',message.view);
      setView(message.view);
    }else if(message.search || message.search === ''){
      localStorage.setItem('search',message.search);
      setSearchValue(message.search);
      console.log('searchValue',searchValue);
    }
  }

  const fromTile = (message:any) => {
    console.log('MESSAGE FROM Tile',message);
    if(message.record){
      localStorage.setItem('lastView',view);
      setLastView('tile');

      setView('product');
      localStorage.setItem('view','product');
      localStorage.setItem('record',JSON.stringify(message.record));
    }
  }

  const fromList = (message:any) => {
    console.log('MESSAGE FROM LIST',message);
    if(message.record){
      localStorage.setItem('lastView',view);
      setLastView('list');
      setView('product');
      localStorage.setItem('view','product');
      localStorage.setItem('record',JSON.stringify(message.record));
    }
  }
  const updateListData = (newData:any) => {
    setListData(newData);
  };

  const fromProduct = (message:any) => {
    console.log('MESSAGE FROM PRODUCT',message);
    console.log('klast view',lastView);
    if(message.click == 'back'){
      localStorage.setItem('view',lastView);
      if(lastView == 'product'){
        setView('list');
      }else{
        setView(lastView);
      }
    }
  }

  async function loadData(){
    console.log('LOAD DATA APP');
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    console.log(res);
    localStorage.setItem('data',JSON.stringify(res.devices));
  }

  return (
    
    <div className="App">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </head>
      <Navbar></Navbar>

      {view == 'product'?
      ''
      :
      <Optionbar  toOption={fromOption}></Optionbar>

      }
      {view == 'list'?
      <Listgrid toList={fromList} updateList={updateListData}></Listgrid>
      :
      view == 'tile'?
      <Tilegrid toTile={fromTile}></Tilegrid>
      :
      <Productview toProduct={fromProduct}></Productview>
      }

    </div>
  );
}

export default App;

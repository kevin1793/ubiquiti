import React , { useState, useEffect } from 'react';
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

  var listData = [];
  useEffect(() => {
    console.log("loaded");
    console.log(localStorage.getItem('view'));
    loadData();

    console.log('view',view);
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
      setView(message.view);
      localStorage.setItem('view',message.view);
    }
  }

  const fromTile = (message:any) => {
    console.log('MESSAGE FROM Tile',message);
    if(message.record){
      setView('product');
      localStorage.setItem('view','product');
      localStorage.setItem('record',JSON.stringify(message.record));
    }
  }

  const fromList = (message:any) => {
    console.log('MESSAGE FROM LIST',message);
    if(message.record){
      setView('product');
      localStorage.setItem('view','product');
      localStorage.setItem('record',JSON.stringify(message.record));
    }
  }

  async function loadData(){
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    console.log(res);
    localStorage.setItem('data',JSON.stringify(res.devices));
    listData = res.devices;
    // currentView = localStorage.getItem('view')?JSON.stringify(localStorage.getItem('view')):'';
  }

  return (
    
    <div className="App">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </head>
      <Navbar></Navbar>
      <Optionbar  toOption={fromOption}></Optionbar>
      {view == 'list'?
      <Listgrid toList={fromList}></Listgrid>
      :
      view == 'tile'?
      <Tilegrid toTile={fromTile}></Tilegrid>
      :
      <Productview></Productview>
      }

    </div>
  );
}

export default App;

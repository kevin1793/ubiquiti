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
  const [selectedFilter,setSelectedFilter] = useState([]);

  useEffect(() => {
    var localView:any = localStorage.getItem('view');
    if(localView?.length){
      setView(localView)
    }
  });

  const fromOption = (message:any) => {
    if(message.view){
      localStorage.setItem('view',message.view);
      setView(message.view);
    }else if(message.search || message.search === ''){
      setSearchValue(message.search);
    }else if(message.filter  || message.filter.length == 0){
      setSelectedFilter(message.filter);
      updateListData(message.filter);
      setSearchValue(searchValue+message.filter.length);
    }
  }

  const fromTile = (message:any) => {
    if(message.record){
      localStorage.setItem('index',message.index);
      localStorage.setItem('lastView',view);
      setLastView('tile');

      setView('product');
      localStorage.setItem('view','product');
      localStorage.setItem('record',JSON.stringify(message.record));
    }
  }

  const fromList = (message:any) => {
    if(message.record){
      localStorage.setItem('index',message.index);
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
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
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
      <Tilegrid toTile={fromTile} ></Tilegrid>
      :
      view == 'product'?
      <Productview toProduct={fromProduct}></Productview>
      :
      ''
      }

    </div>
  );
}

export default App;

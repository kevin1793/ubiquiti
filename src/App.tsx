import React , { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Navbar from './components/navbar';
import Optionbar from './components/optionbar';
import Listgrid from './components/listgrid';
import Tilegrid from './components/tilegrid';
import Productview from './components/productview';

function App() {
  var listData = [];
  useEffect(() => {
    // call api or anything
    console.log("loaded");
    loadData();
  });

  async function loadData(){
    var data = await fetch('https://static.ui.com/fingerprint/ui/public.json');
    const res = await data.json();
    console.log(res);
    localStorage.setItem('data',JSON.stringify(res.devices));
    listData = res.devices;
  }

  return (
    <div className="App">
      <Navbar></Navbar>
      <Optionbar></Optionbar>
      <Tilegrid></Tilegrid>
      <Listgrid></Listgrid>
      <Productview></Productview>
    </div>
  );
}

export default App;

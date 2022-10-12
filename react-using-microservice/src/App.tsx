import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateProduct from './Admin/CreateProduct';
import EditProduct from './Admin/EditProduct';
import Products from './Admin/Products';
import './App.css';
import Header from './Components/Header';
import SideNav from './Components/SideNav';
import Main from './Main/Main';

function App() {
  return (
    <div className='container-fluid'>

      <BrowserRouter>
        <div className="row">
          <Header />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <SideNav />

            

            <Routes>
              <Route index element={<Main />} />
              <Route path='/' element={<Main />} />
              <Route path='/admin/products' element={<Products />} />
              <Route path='/admin/products/create' element={<CreateProduct />} />
              <Route path='/admin/products/:id/edit' element={<EditProduct />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>

    </div>
  );
}

export default App;

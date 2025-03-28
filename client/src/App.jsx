import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AdminPrivateRoute from './components/AdminPrivateRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import About from './pages/main/About.jsx';
import CreateCustomer from './pages/secondary/CreateCustomer.jsx';
import CreateSupplier from './pages/secondary/CreateSupplier.jsx';
import Dashboard from './pages/main/Dashboard.jsx';
import Home from './pages/main/Home.jsx';
import Layout from './pages/Layout.jsx';
import Login from './pages/main/Login.jsx';
import Register from './pages/main/Register.jsx';
import Search from './pages/main/Search.jsx';
import SupplierPage from './pages/secondary/SupplierPage.jsx';
import UpdateSupplier from './pages/secondary/UpdateSupplier.jsx';
import CreateMaterial from './pages/secondary/CreateMaterial.jsx';
import CreateProduct from './pages/secondary/CreateProduct.jsx';
import UpdateMaterial from './pages/secondary/UpdateMaterial.jsx';
import UpdateProduct from './pages/secondary/UpdateProduct.jsx';

const App = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				<Route element={<Layout />}>
					<Route path='/' element={<Home />} />
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
					<Route path='/about' element={<About />} />
					<Route path='/search' element={<Search />} />
					<Route path='/dashboard' element={<Dashboard />} />

					<Route path='/create-material' element={<CreateMaterial />} />
					<Route
						path='/update-material/:materialId'
						element={<UpdateMaterial />}
					/>

					<Route path='/create-product' element={<CreateProduct />} />
					<Route
						path='/update-product/:productId'
						element={<UpdateProduct />}
					/>

					<Route path='/create-supplier' element={<CreateSupplier />} />

					<Route path='/create-customer' element={<CreateCustomer />} />
					<Route
						path='/update-supplier/:supplierId'
						element={<UpdateSupplier />}
					/>
					<Route path='/supplier/:supplierSlug' element={<SupplierPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;

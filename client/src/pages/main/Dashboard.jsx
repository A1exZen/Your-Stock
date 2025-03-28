import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardComp from '../../components/dash/DashboardComp.jsx';
import DashProducts from '../../components/dash/DashProducts.jsx'
import DashProfile from '../../components/dash/DashProfile.jsx';
import DashSuppliers from '../../components/dash/DashSuppliers.jsx';
import DashMaterials from '../../components/dash/DashMaterials.jsx';
import DashCustomers from '../../components/dash/DashCustomers.jsx';
import DashUsers from '../../components/dash/DashUsers.jsx';

const Dashboard = () => {
	const location = useLocation();
	const [tab, setTab] = useState('');
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		<div className='min-h-screen flex flex-col md:flex-row'>
			{/* <div className='md:w-56'> */}
			{/*DashSidebar*/}
			{/* <DashSidebar /> */}
			{/* </div> */}
			{/*	Profile*/}
			{tab === 'profile' && <DashProfile />}
			{/*	suppliers*/}
			{tab === 'suppliers' && <DashSuppliers />}
			{/*	customers*/}
			{tab === 'customers' && <DashCustomers />}
			{/*	materials */}
			{tab === 'materials' && <DashMaterials />}
			{/*	products */}
			{tab === 'products' && <DashProducts />}
			{/* Users */}
			{tab === 'users' && <DashUsers />}
			{/*	DashboardComponent*/}
			{tab === 'dash' && <DashboardComp />}
		</div>
	);
};

export default Dashboard;

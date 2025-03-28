import { Outlet, Route } from 'react-router-dom';
import FooterComp from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import DashSidebar from '../components/dash/DashSidebar.jsx';
import { useState } from 'react';

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return (
		<div>
			<div className='flex h-screen overflow-hidden'>
				<DashSidebar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
				<div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden '>
					<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
					<main>
						<div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
							<Outlet />
						</div>
					</main>
				</div>
			</div>
			{/* <FooterComp /> */}
		</div>
	);
};

export default Layout;

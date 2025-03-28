import { Sidebar, Drawer, Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBackOutline, IoLogIn, IoLogInOutline } from 'react-icons/io5';
import { FaUsersCog } from 'react-icons/fa';
import { LiaUserTagSolid, LiaUserLockSolid, LiaUser } from 'react-icons/lia';
import { VscLayers } from 'react-icons/vsc';
import { HiChartPie } from 'react-icons/hi';
import { FaBoxOpen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { signOutSuccess } from '../../redux/user/userSlice.js';

const DashSidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { currentUser } = useSelector(state => state.user);
	const [tab, setTab] = useState('');

	const trigger = useRef(null);
	const sidebar = useRef(null);
	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener('click', clickHandler);
		return () => document.removeEventListener('click', clickHandler);
	});
	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener('keydown', keyHandler);
		return () => document.removeEventListener('keydown', keyHandler);
	});

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	// const handleSignOut = async () => {
	// 	try {
	// 		const res = await fetch('/api/user/signout', {
	// 			method: 'POST',
	// 		});
	// 		const data = await res.json();
	// 		if (!res.ok) {
	// 			console.log(data.message);
	// 		} else {
	// 			dispatch(signOutSuccess());
	// 		}
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// };

	return (
		<div>
			<Sidebar
				id='sidebar'
				refs={sidebar}
				className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:translate-x-0 h-screen w-64 transition-all duration-300 ease-in-out ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-64'
				}`}
			>
				<div className='flex justify-between lg:justify-center items-center mb-10 pr-3 sm:px-2'>
					{/* Close button */}
					<button
						ref={trigger}
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className=' lg:hidden text-slate-500 hover:text-slate-400'
						aria-controls='sidebar'
						aria-expanded={sidebarOpen}
					>
						<IoArrowBackOutline className='w-6 h-6' />
					</button>
					<NavLink
						to='/'
						className=' flex items-center text-sm sm:text-xl font-semibold dark:text-white'
					>
						Your
						<span className='ml-1 px-2 py-1 bg-gradient-to-r transition ease-in-out duration-200  from-indigo-500 to-blue-500 rounded-lg text-white animate-shine  hover:from-blue-500 hover:to-indigo-500'>
							Stock
						</span>
					</NavLink>
				</div>

				<Sidebar.Items>
					<Sidebar.ItemGroup className='flex flex-col gap-0.5'>
						{!currentUser && (
							<>
								<Link to='/login'>
									<Sidebar.Item
										active={location.pathname === '/login'}
										icon={IoLogInOutline}
										as='div'
									>
										Авторизация
									</Sidebar.Item>
								</Link>
								<Link to='/register'>
									<Sidebar.Item
										active={location.pathname === '/register'}
										icon={IoLogIn}
										as='div'
									>
										Регистрация
									</Sidebar.Item>
								</Link>
							</>
						)}
						{currentUser && (
							<Link to='/dashboard?tab=dash'>
								<Sidebar.Item
									active={tab === 'dash' || !tab}
									icon={HiChartPie}
									as='div'
								>
									Панель инструментов
								</Sidebar.Item>
							</Link>
						)}
						{currentUser && (
							<Link to='/dashboard?tab=profile'>
								<Sidebar.Item
									as='div'
									active={tab === 'profile'}
									icon={LiaUser}
									label={
										currentUser &&
										(currentUser.isAdmin || currentUser.role === 'admin')
											? 'Admin'
											: currentUser.role === 'materialManager'
											? 'Material Man.'
											: currentUser.role === 'productionManager'
											? 'Production Man.'
											: currentUser.role === 'productManager'
											? 'Product Man.'
											: 'User'
									}
									labelColor='dark'
								>
									Профиль
								</Sidebar.Item>
							</Link>
						)}
					</Sidebar.ItemGroup>
					<Sidebar.ItemGroup className='flex flex-col gap-0.5'>
						{currentUser &&
							(currentUser.isAdmin ||
								currentUser.role === 'materialManager' ||
								currentUser.role === 'productionManager' ||
								currentUser.role === 'admin') && (
								<Link to='/dashboard?tab=materials'>
									<Sidebar.Item
										active={tab === 'materials'}
										icon={VscLayers}
										as='div'
									>
										Материалы
									</Sidebar.Item>
								</Link>
							)}
						{currentUser &&
							(currentUser.isAdmin ||
								currentUser.role === 'productionManager' ||
								currentUser.role === 'productManager' ||
								currentUser.role === 'admin') && (
								<Link to='/dashboard?tab=products'>
									<Sidebar.Item
										active={tab === 'products'}
										icon={FaBoxOpen}
										as='div'
									>
										Продукты
									</Sidebar.Item>
								</Link>
							)}
					</Sidebar.ItemGroup>
					<Sidebar.ItemGroup className='flex flex-col gap-0.5'>
						{currentUser &&
							(currentUser.isAdmin ||
								currentUser.role === 'materialManager' ||
								currentUser.role === 'admin') && (
								<Link to='/dashboard?tab=suppliers'>
									<Sidebar.Item
										active={tab === 'suppliers'}
										icon={LiaUserLockSolid}
										as='div'
									>
										Поставщики
									</Sidebar.Item>
								</Link>
							)}
						{currentUser &&
							(currentUser.isAdmin ||
								currentUser.role === 'productManager') && (
								<Link to='/dashboard?tab=customers'>
									<Sidebar.Item
										active={tab === 'customers'}
										icon={LiaUserTagSolid}
										as='div'
									>
										Покупатели
									</Sidebar.Item>
								</Link>
							)}
						{currentUser &&
							(currentUser.isAdmin || currentUser.role === 'admin') && (
								<Link to='/dashboard?tab=users'>
									<Sidebar.Item
										active={tab === 'users'}
										icon={FaUsersCog}
										as='div'
									>
										Пользователи
									</Sidebar.Item>
								</Link>
							)}
					</Sidebar.ItemGroup>
				</Sidebar.Items>
			</Sidebar>
		</div>
	);
};

export default DashSidebar;

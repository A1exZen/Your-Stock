import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	HiAnnotation,
	HiArrowNarrowUp,
	HiDocumentText,
	HiOutlineUserGroup,
} from 'react-icons/hi';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip as ChartTooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
} from 'chart.js';
import { IoArrowBackOutline, IoLogIn, IoLogInOutline } from 'react-icons/io5';
import { FaUsersCog } from 'react-icons/fa';
import { LiaUserTagSolid, LiaUserLockSolid, LiaUser } from 'react-icons/lia';
import { VscLayers } from 'react-icons/vsc';
import { HiChartPie } from 'react-icons/hi';
import { FaBoxOpen } from 'react-icons/fa';
import { Button, Table, Tooltip } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { MdOutlineAdminPanelSettings, MdOutlineFactory } from 'react-icons/md';
import { RiUserLine } from 'react-icons/ri';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	ChartTooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
);

export default function DashboardComp() {
	const [users, setUsers] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [customers, setCustomers] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [products, setProducts] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalSuppliers, setTotalSuppliers] = useState(0);
	const [totalCustomers, setTotalCustomers] = useState(0);
	const [totalMaterials, setTotalMaterials] = useState(0);
	const [totalProducts, setTotalProducts] = useState(0);
	const [lastMonthUsers, setLastMonthUsers] = useState(0);
	const [lastMonthSuppliers, setLastMonthSuppliers] = useState(0);
	const [lastMonthCustomers, setLastMonthCustomers] = useState(0);
	const [lastMonthMaterials, setLastMonthMaterials] = useState(0);
	const [lastMonthProducts, setLastMonthProducts] = useState(0);
	const { currentUser } = useSelector(state => state.user);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch('/api/user/get-users?limit=5');
				const data = await res.json();
				if (res.ok) {
					setUsers(data.users);
					setTotalUsers(data.totalUsers);
					setLastMonthUsers(data.lastMonthUsers);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchSuppliers = async () => {
			try {
				const res = await fetch('/api/supplier/get-all?limit=5');
				const data = await res.json();
				if (res.ok) {
					setSuppliers(data.suppliers);
					setTotalSuppliers(data.totalSuppliers);
					setLastMonthSuppliers(data.lastMonthSuppliers);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchCustomers = async () => {
			try {
				const res = await fetch('/api/customer/get-all?limit=5');
				const data = await res.json();
				if (res.ok) {
					setCustomers(data.customers);
					setTotalCustomers(data.totalCustomers);
					setLastMonthCustomers(data.lastMonthCustomers);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchMaterials = async () => {
			try {
				const res = await fetch('/api/material/get-all?limit=5');
				const data = await res.json();
				if (res.ok) {
					setMaterials(data.materials);
					setTotalMaterials(data.totalMaterials);
					setLastMonthMaterials(data.lastMonthMaterials);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		const fetchProducts = async () => {
			try {
				const res = await fetch('/api/product/get-all?limit=5');
				const data = await res.json();
				if (res.ok) {
					setProducts(data.products);
					setTotalProducts(data.totalProducts);
					setLastMonthProducts(data.lastMonthProducts);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchUsers();
		fetchSuppliers();
		fetchMaterials();
		fetchProducts();
		fetchCustomers();
	}, [currentUser]);

	const lineData = {
		labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
		datasets: [
			{
				label: 'Материалы',
				data: [12, 15, 20, 25, 30, totalMaterials], // Примерные данные, замените на реальные
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
			},
			{
				label: 'Продукты',
				data: [8, 10, 12, 15, 20, totalProducts], // Примерные данные, замените на реальные
				borderColor: 'rgba(153, 102, 255, 1)',
				backgroundColor: 'rgba(153, 102, 255, 0.2)',
			},
			{
				label: 'Пользователи',
				data: [5, 7, 10, 13, 15, totalUsers], // Примерные данные, замените на реальные
				borderColor: 'rgba(255, 99, 132, 1)',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
			},
			{
				label: 'Поставщики',
				data: [3, 4, 5, 6, 8, totalSuppliers], // Примерные данные, замените на реальные
				borderColor: 'rgba(54, 162, 235, 1)',
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
			},
			{
				label: 'Покупатели',
				data: [6, 8, 9, 11, 13, totalCustomers], // Примерные данные, замените на реальные
				borderColor: 'rgba(255, 206, 86, 1)',
				backgroundColor: 'rgba(255, 206, 86, 0.2)',
			},
		],
	};

	return (
		<div className='p-3 md:mx-auto'>
			{/* Total */}
			<div className='flex-wrap flex gap-4 justify-center'>
				<div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div>
							<h3 className='text-gray-500 text-md uppercase'>
								Всего материалов
							</h3>
							<p className='text-2xl'>{totalMaterials}</p>
						</div>
						<VscLayers className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{lastMonthMaterials}
						</span>
						<div className='text-gray-500'>Прошлый месяц</div>
					</div>
				</div>

				<div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div>
							<h3 className='text-gray-500 text-md uppercase'>
								Всего продуктов
							</h3>
							<p className='text-2xl'>{totalProducts}</p>
						</div>
						<FaBoxOpen className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{lastMonthProducts}
						</span>
						<div className='text-gray-500'>Прошлый месяц</div>
					</div>
				</div>

				<div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div>
							<h3 className='text-gray-500 text-md uppercase'>
								Всего пользователей
							</h3>
							<p className='text-2xl'>{totalUsers}</p>
						</div>
						<FaUsersCog className='bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{lastMonthUsers}
						</span>
						<div className='text-gray-500'>Прошлый месяц</div>
					</div>
				</div>

				<div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>
								Всего поставщиков
							</h3>
							<p className='text-2xl'>{totalSuppliers}</p>
						</div>
						<LiaUserLockSolid className='bg-blue-600 text-white rounded-full text-5xl p-2.5 shadow-lg' />
					</div>
					<div className='flex  gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{lastMonthSuppliers}
						</span>
						<div className='text-gray-500'>Прошлый месяц</div>
					</div>
				</div>

				<div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
					<div className='flex justify-between'>
						<div className=''>
							<h3 className='text-gray-500 text-md uppercase'>
								Всего покупателей
							</h3>
							<p className='text-2xl'>{totalCustomers}</p>
						</div>
						<LiaUserTagSolid className='bg-blue-600 text-white rounded-full text-5xl p-2.5 shadow-lg' />
					</div>
					<div className='flex gap-2 text-sm'>
						<span className='text-green-500 flex items-center'>
							<HiArrowNarrowUp />
							{lastMonthCustomers}
						</span>
						<div className='text-gray-500'>Прошлый месяц</div>
					</div>
				</div>
			</div>

			{/* <div className='flex-wrap flex gap-4 justify-center mt-5'>
				<div className='w-full p-3'>
					<Line data={lineData} />
				</div>
			</div> */}

			{/* Recent */}
			<div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
				<div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
					<div className='flex justify-between p-3 text-sm font-semibold'>
						<h1 className='text-center p-2'>Последние пользователи</h1>
						<Button outline color='blue'>
							<Link to={'/dashboard?tab=users'}>Все</Link>
						</Button>
					</div>
					<Table hoverable>
						<Table.Head>
							<Table.HeadCell>Фото</Table.HeadCell>
							<Table.HeadCell>Имя пользователя</Table.HeadCell>
							<Table.HeadCell>Роль</Table.HeadCell>
						</Table.Head>
						{users &&
							users.map(user => (
								<Table.Body key={user._id} className='divide-y'>
									<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
										<Table.Cell>
											<img
												src={user.profilePicture}
												alt='user'
												className='w-9 h-9 rounded-full bg-gray-500'
											/>
										</Table.Cell>
										<Table.Cell>{user.username}</Table.Cell>
										<Table.Cell>
											{user.role === 'materialManager' ? (
												<Tooltip content='Зав. материалов' arrow={false}>
													<VscLayers className='w-5 h-5' />
												</Tooltip>
											) : user.role === 'productionManager' ? (
												<Tooltip content='Зав. производства' arrow={false}>
													<MdOutlineFactory className='w-5 h-5' />
												</Tooltip>
											) : user.role === 'productManager' ? (
												<Tooltip content='Зав. продукции' arrow={false}>
													<FaBoxOpen className='w-5 h-5' />
												</Tooltip>
											) : user.isAdmin ? (
												<Tooltip content='Admin' arrow={false}>
													<MdOutlineAdminPanelSettings className='w-5 h-5' />
												</Tooltip>
											) : (
												<Tooltip content='Пользователь' arrow={false}>
													<RiUserLine className='w-5 h-5' />
												</Tooltip>
											)}
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>

				<div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
					<div className='flex justify-between  p-3 text-sm font-semibold'>
						<h1 className='text-center p-2'>Последние поставщики</h1>
						<Button outline color='blue'>
							<Link to={'/dashboard?tab=suppliers'}>Все</Link>
						</Button>
					</div>
					<Table hoverable>
						<Table.Head>
							<Table.HeadCell>Фото</Table.HeadCell>
							<Table.HeadCell>Имя</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
						</Table.Head>
						{suppliers &&
							suppliers.map(supplier => (
								<Table.Body key={supplier._id} className='divide-y'>
									<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
										<Table.Cell>
											<img
												src={supplier.image}
												alt='user'
												className='w-10 h-10 rounded-md bg-gray-500'
											/>
										</Table.Cell>
										<Table.Cell className='w-56'>{supplier.name}</Table.Cell>
										<Table.Cell className='w-50'>{supplier.email}</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>
			</div>
		</div>
	);
}

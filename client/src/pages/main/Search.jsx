import { Button, Select, Table, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Search() {
	const [sidebarData, setSidebarData] = useState({
		searchTerm: '',
		sort: 'desc',
		category: 'uncategorized',
	});

	console.log(sidebarData);
	const [suppliers, setSuppliers] = useState([]);
	const [products, setProducts] = useState([]);
	const [materials, setMaterials] = useState([]);

	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		const sortFromUrl = urlParams.get('sort');
		if (searchTermFromUrl || sortFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
			});
		}

		const fetchSuppliers = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/supplier/get-all?${searchQuery}`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			if (res.ok) {
				const data = await res.json();
				setSuppliers(data.suppliers);
				setLoading(false);
				if (data.suppliers.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			}
		};
		// const fetchProducts = async () => {
		// 	setLoading(true);
		// 	const searchQuery = urlParams.toString();
		// 	const res = await fetch(`/api/products/get-all?${searchQuery}`);
		// 	if (!res.ok) {
		// 		setLoading(false);
		// 		return;
		// 	}
		// 	if (res.ok) {
		// 		const data = await res.json();
		// 		setProducts(data.products);
		// 		setLoading(false);
		// 		if (data.products.length === 9) {
		// 			setShowMore(true);
		// 		} else {
		// 			setShowMore(false);
		// 		}
		// 	}
		// };
		// const fetchMaterials = async () => {
		// 	setLoading(true);
		// 	const searchQuery = urlParams.toString();
		// 	const res = await fetch(`/api/materials/get-all?${searchQuery}`);
		// 	if (!res.ok) {
		// 		setLoading(false);
		// 		return;
		// 	}
		// 	if (res.ok) {
		// 		const data = await res.json();
		// 		setMaterials(data.materials);
		// 		setLoading(false);
		// 		if (data.materials.length === 9) {
		// 			setShowMore(true);
		// 		} else {
		// 			setShowMore(false);
		// 		}
		// 	}
		// };
		fetchSuppliers();
		// fetchProducts();
		// fetchMaterials();
	}, [location.search]);

	const handleChange = e => {
		if (e.target.id === 'searchTerm') {
			setSidebarData({ ...sidebarData, searchTerm: e.target.value });
		}
		if (e.target.id === 'sort') {
			const order = e.target.value || 'desc';
			setSidebarData({ ...sidebarData, sort: order });
		}
		// if (e.target.id === 'category') {
		// 	const category = e.target.value || 'uncategorized'
		// 	setSidebarData({ ...sidebarData, category })
		// }
	};

	const handleSubmit = e => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set('searchTerm', sidebarData.searchTerm);
		urlParams.set('sort', sidebarData.sort);
		// urlParams.set('category', sidebarData.category)
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	const handleShowMore = async () => {
		const numberOfSuppliers = suppliers.length;
		const startIndex = numberOfSuppliers;
		const urlParams = new URLSearchParams(location.search);
		urlParams.set('startIndex', startIndex);
		const searchQuery = urlParams.toString();
		const res = await fetch(`/api/supplier/get-all?${searchQuery}`);
		if (!res.ok) return;
		if (res.ok) {
			const data = await res.json();
			setSuppliers([...suppliers, ...data.suppliers]);
			if (data.posts.length === 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	};

	return (
		<div className='flex flex-col md:flex-row'>
			<div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
				<form className='flex flex-col gap-8' onSubmit={handleSubmit}>
					<div className='flex items-center gap-2'>
						<label className='whitespace-nowrap font-semibold'>Поиск:</label>
						<TextInput
							placeholder='Search...'
							id='searchTerm'
							type='text'
							value={sidebarData.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className='flex items-center justify-between gap-2'>
						<label className='font-semibold'>Сортировка:</label>
						<Select onChange={handleChange} value={sidebarData.sort} id='sort'>
							<option value='desc'>Новые</option>
							<option value='asc'>Старые</option>
						</Select>
					</div>
					{/*<div className='flex items-center gap-2'>*/}
					{/*	<label className='font-semibold'>Category:</label>*/}
					{/*	<Select*/}
					{/*		onChange={handleChange}*/}
					{/*		value={sidebarData.category}*/}
					{/*		id='category'*/}
					{/*	>*/}
					{/*		<option value='uncategorized'>Uncategorized</option>*/}
					{/*		<option value='reactjs'>React.js</option>*/}
					{/*		<option value='nextjs'>Next.js</option>*/}
					{/*		<option value='javascript'>JavaScript</option>*/}
					{/*	</Select>*/}
					{/*</div>*/}
					<Button type='submit' outline gradientDuoTone='purpleToPink'>
						Применить фильтры
					</Button>
				</form>
			</div>
			<div className='w-full'>
				<h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
					Результат поиска:
				</h1>
				<div className='table-auto md:mx-auto px-12 py-7 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
					{!loading && suppliers.length === 0 && (
						<p className='text-xl text-gray-500'></p>
					)}
					{loading && <p className='text-xl text-gray-500 '>Loading...</p>}
					<Table hoverable className='w-full shadow-md '>
						<Table.Head>
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Phone Number</Table.HeadCell>
							<Table.HeadCell>INN</Table.HeadCell>
						</Table.Head>
						{!loading &&
							suppliers &&
							suppliers.map(supplier => (
								<Table.Body key={supplier._id} className='divide-y'>
									<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
										<Table.Cell>
											{' '}
											{new Date(supplier.updatedAt).toLocaleDateString()}{' '}
										</Table.Cell>
										<Table.Cell>
											<Link
												className='font-medium text-gray-900 dark:text-white'
												to={`/supplier/${supplier.slug}`}
											>
												{supplier.name}
											</Link>
										</Table.Cell>
										<Table.Cell>
											<Link
												className='font-medium text-gray-900 dark:text-white'
												to={`/supplier/${supplier.slug}`}
											>
												{supplier.email}
											</Link>
										</Table.Cell>
										<Table.Cell>{supplier.phoneNumber}</Table.Cell>
										<Table.Cell>{supplier.INN}</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>
				{showMore && (
					<button
						onClick={handleShowMore}
						className='text-teal-500 text-lg hover:underline p-7 w-full'
					>
						Show More
					</button>
				)}
			</div>
		</div>
	);
}

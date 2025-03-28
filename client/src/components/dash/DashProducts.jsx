import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashProducts() {
	const { currentUser } = useSelector(state => state.user);
	const [userProducts, setUserProducts] = useState([]);
	const [userCustomers, setUserCustomers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [productIdToDelete, setProductIdToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`/api/product/get-all?userId=${currentUser._id}`
				);
				const data = await res.json();
				console.log('Data Products', data);
				if (res.ok) {
					setLoading(false);
					setUserProducts(data.products);
					if (data.products.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin || currentUser.role === 'productManager') {
			fetchProducts();
		}
	}, [currentUser._id]);

	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				const res = await fetch(
					`/api/customer/get-all?userId=${currentUser._id}`
				);
				const data = await res.json();
				if (res.ok) {
					setUserCustomers(data.customers);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchCustomers();
	}, [userProducts]);

	const handleShowMore = async () => {
		const startIndex = userProducts.length;
		try {
			const res = await fetch(
				`/api/product/get-all?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserProducts(prev => [...prev, ...data.products]);
				if (data.products.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteProduct = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/product/delete/${productIdToDelete}/${currentUser._id}`,
				{
					method: 'DELETE',
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserProducts(prev =>
					prev.filter(product => product._id !== productIdToDelete)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	if (loading) {
		return (
			<div className='flex mx-auto items-center min-h-screen'>
				<Spinner size='xl' />
			</div>
		);
	}
	return (
		<div className='table-auto overflow-x-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			<div className='mb-5 flex justify-center'>
				<Link to={'/create-product'}>
					<Button type='button' color='blue'>
						Добавить Продукт
					</Button>
				</Link>
			</div>
			{(currentUser.isAdmin || currentUser.role === 'productManager') &&
			userCustomers.length > 0 &&
			userProducts.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Дата обновления</Table.HeadCell>
							<Table.HeadCell>Название</Table.HeadCell>
							<Table.HeadCell>Цена</Table.HeadCell>
							<Table.HeadCell>Покупатель</Table.HeadCell>
							<Table.HeadCell>Удалить</Table.HeadCell>
							{/* <Table.HeadCell>
								<span>Изменить</span>
							</Table.HeadCell> */}
						</Table.Head>
						{userProducts.map(product => (
							<Table.Body key={product._id} className='divide-y'>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										{' '}
										{new Date(product.updatedAt).toLocaleDateString()}{' '}
									</Table.Cell>
									<Table.Cell>
										<Link
											className='font-semibold'
											to={`/product/${product.slug}`}
										>
											{product.name}
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link to={`/product/${product.slug}`}>{product.price}</Link>
									</Table.Cell>
									<Table.Cell>
										{
											userCustomers.find(
												customer => customer._id === product.customer
											).name
										}
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setProductIdToDelete(product._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Удалить
										</span>
									</Table.Cell>
									{/* <Table.Cell>
										<Link
											className='text-teal-500 hover:underline'
											to={`/update-product/${product._id}`}
										>
											<span>Изменить</span>
										</Link>
									</Table.Cell> */}
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className='w-full text-teal-500 self-center text-sm py-7'
						>
							Показать больше
						</button>
					)}
				</>
			) : (
				<p>Пока что продуктов нет!</p>
			)}
			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size='md'
			>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
						<h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
							Вы уверены, что хотите удалить продукт?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteProduct}>
								Да, уверен
							</Button>
							<Button color='gray' onClick={() => setShowModal(false)}>
								Нет, закрыть
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

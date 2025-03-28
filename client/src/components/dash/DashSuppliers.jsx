import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginSuccess } from '../../redux/user/userSlice.js';

export default function DashSuppliers() {
	const { currentUser } = useSelector(state => state.user);
	const [userSuppliers, setUserSuppliers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [supplierIdToDelete, setSupplierIdToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSuppliers = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/supplier/get-all`);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setUserSuppliers(data.suppliers);
					if (data.suppliers.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (
			currentUser.isAdmin ||
			currentUser.role === 'materialManager' ||
			currentUser.role === 'admin'
		) {
			fetchSuppliers();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userSuppliers.length;
		try {
			const res = await fetch(`/api/supplier/get-all&startIndex=${startIndex}`);
			const data = await res.json();
			if (res.ok) {
				setUserSuppliers(prev => [...prev, ...data.suppliers]);
				if (data.suppliers.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteSupplier = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/supplier/delete/${supplierIdToDelete}/${currentUser._id}`,
				{
					method: 'DELETE',
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserSuppliers(prev =>
					prev.filter(supplier => supplier._id !== supplierIdToDelete)
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
			<div className='mb-5  flex justify-center'>
				<Link to={'/create-supplier'}>
					<Button type='button' color='blue'>
						Добавить Поставщика
					</Button>
				</Link>
			</div>
			{(currentUser.isAdmin || currentUser.role === 'materialManager') &&
			userSuppliers.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Дата обновления</Table.HeadCell>
							<Table.HeadCell>Имя</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Телефон</Table.HeadCell>
							<Table.HeadCell>Удалить</Table.HeadCell>
							<Table.HeadCell>
								<span>Изменить</span>
							</Table.HeadCell>
						</Table.Head>
						{userSuppliers.map(supplier => (
							<Table.Body key={supplier.name} className='divide-y'>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										{' '}
										{new Date(supplier.updatedAt).toLocaleDateString()}{' '}
									</Table.Cell>
									<Table.Cell>
										<Link
											className='font-semibold'
											to={`/supplier/${supplier.slug}`}
										>
											{supplier.name}
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link to={`/supplier/${supplier.slug}`}>
											{supplier.email}
										</Link>
									</Table.Cell>
									<Table.Cell>{supplier.phoneNumber}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setSupplierIdToDelete(supplier._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Удалить
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className='text-teal-500 hover:underline'
											to={`/update-supplier/${supplier._id}`}
										>
											<span>Изменить</span>
										</Link>
									</Table.Cell>
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
				<p>Пока что поставщиков нет!</p>
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
							Вы уверены, что хотите удалить поставщика?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteSupplier}>
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

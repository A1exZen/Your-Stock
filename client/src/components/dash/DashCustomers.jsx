import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashCustomers() {
	const { currentUser } = useSelector(state => state.user);
	const [userCustomers, setUserCustomers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [customerIdToDelete, setCustomerIdToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`/api/customer/get-all?userId=${currentUser._id}`
				);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setUserCustomers(data.customers);
					if (data.customers.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchCustomers();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userCustomers.length;
		try {
			const res = await fetch(
				`/api/customer/get-all?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserCustomers(prev => [...prev, ...data.customers]);
				if (data.customers.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteCustomer = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/customer/delete/${customerIdToDelete}/${currentUser._id}`,
				{
					method: 'DELETE',
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserCustomers(prev =>
					prev.filter(customer => customer._id !== customerIdToDelete)
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
		<div className='table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			<div className='mb-5  flex justify-center'>
				<Link to={'/create-customer'}>
					<Button type='button' color='blue'>
						Добавить Покупателя
					</Button>
				</Link>
			</div>
			{currentUser.isAdmin && userCustomers.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Дата обновления</Table.HeadCell>
							<Table.HeadCell>Имя</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Телефон</Table.HeadCell>
							<Table.HeadCell>Удалить</Table.HeadCell>
							{/* <Table.HeadCell>
								<span>Изменить</span>
							</Table.HeadCell> */}
						</Table.Head>
						{userCustomers.map(customer => (
							<Table.Body key={customer.name} className='divide-y'>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										{' '}
										{new Date(customer.updatedAt).toLocaleDateString()}{' '}
									</Table.Cell>
									<Table.Cell>
										<Link
											className='font-semibold'
											to={`/customer/${customer.slug}`}
										>
											{customer.name}
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											className='font-semibold'
											to={`/customer/${customer.slug}`}
										>
											{customer.email}
										</Link>
									</Table.Cell>
									<Table.Cell>{customer.phoneNumber}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setCustomerIdToDelete(customer._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Удалить
										</span>
									</Table.Cell>
									{/* <Table.Cell>
										<Link
											className='text-teal-500 hover:underline'
											to={`/update/${customer._id}`}
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
				<p>Пока что покупателей нет!</p>
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
							Вы уверены, что хотите удалить покупателя?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteCustomer}>
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

import { Button, Modal, Spinner, Table, Tooltip } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { MdOutlineFactory } from 'react-icons/md';
import { FaBoxOpen } from 'react-icons/fa';
import { VscLayers } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { RiUserLine } from 'react-icons/ri';

export default function DashUsers() {
	const { currentUser } = useSelector(state => state.user);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/user/get-users`);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setUsers(data.users);
					if (data.users.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchUsers();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = users.length;
		try {
			const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
			const data = await res.json();
			if (res.ok) {
				setUsers(prev => [...prev, ...data.users]);
				if (data.users.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteUser = async () => {
		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: 'DELETE',
			});
			const data = await res.json();
			if (res.ok) {
				setUsers(prev => prev.filter(user => user._id !== userIdToDelete));
				setShowModal(false);
			} else {
				console.log(data.message);
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
		<div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			{currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Дата создания</Table.HeadCell>
							<Table.HeadCell>Фото</Table.HeadCell>
							<Table.HeadCell>Username</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Роль</Table.HeadCell>
							<Table.HeadCell>Удалить</Table.HeadCell>
						</Table.Head>
						{users.map(user => (
							<Table.Body key={user._id} className='divide-y'>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										{new Date(user.createdAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<img
											src={user.profilePicture}
											alt={user.username}
											className='w-10 h-10 object-cover bg-gray-500 rounded-full'
										/>
									</Table.Cell>
									<Table.Cell className='font-semibold'>
										{user.username}
									</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										{user.isAdmin ? (
											<FaCheck className='text-green-500' />
										) : (
											<FaTimes className='text-red-500' />
										)}
									</Table.Cell>
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
										) : !user.isAdmin ? (
											<Tooltip content='Пользователь' arrow={false}>
												<RiUserLine className='w-5 h-5' />
											</Tooltip>
										) : null}
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setUserIdToDelete(user._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Удалить
										</span>
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
				<p>Пока что пользователей нет</p>
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
							Вы уверены, что хотите удалить пользователя?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteUser}>
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

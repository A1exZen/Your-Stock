import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashMaterials() {
	const { currentUser } = useSelector(state => state.user);
	const [userMaterials, setUserMaterials] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [materialIdToDelete, setMaterialIdToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMaterials = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`/api/material/get-all?userId=${currentUser._id}`
				);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setUserMaterials(data.materials);
					if (data.materials.length < 9) {
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
			fetchMaterials();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userMaterials.length;
		try {
			const res = await fetch(
				`/api/material/get-all?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserMaterials(prev => [...prev, ...data.Materials]);
				if (data.materials.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteMaterial = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/material/delete/${materialIdToDelete}/${currentUser._id}`,
				{
					method: 'DELETE',
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserMaterials(prev =>
					prev.filter(material => material._id !== materialIdToDelete)
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
				<Link to={'/create-material'}>
					<Button type='button' color='blue'>
						Добавить Материал
					</Button>
				</Link>
			</div>
			{(currentUser.isAdmin || currentUser.role === 'materialManager') &&
			userMaterials.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Дата обновления</Table.HeadCell>
							<Table.HeadCell>Название</Table.HeadCell>
							<Table.HeadCell>Кол-во</Table.HeadCell>
							<Table.HeadCell>Цена</Table.HeadCell>
							<Table.HeadCell>Ед. изм.</Table.HeadCell>
							<Table.HeadCell>Удалить</Table.HeadCell>
							<Table.HeadCell>
								<span>Изменить</span>
							</Table.HeadCell>
						</Table.Head>
						{userMaterials.map(material => (
							<Table.Body key={material._id} className='divide-y'>
								<Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
									<Table.Cell>
										{' '}
										{new Date(material.updatedAt).toLocaleDateString()}{' '}
									</Table.Cell>
									<Table.Cell>
										<Link
											className='font-semibold'
											to={`/material/${material.slug}`}
										>
											{material.name}
										</Link>
									</Table.Cell>
									<Table.Cell className='font-semibold'>
										{material.quantity}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/material/${material.slug}`}>
											{material.price}
										</Link>
									</Table.Cell>
									<Table.Cell>{material.unit}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setMaterialIdToDelete(material._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Удалить
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className='text-teal-500 hover:underline'
											to={`/update-material/${material._id}`}
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
				<p>Пока что материалов нет!</p>
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
							Вы уверены, что хотите удалить материал?
						</h3>
						<div className='flex justify-center gap-4'>
							<Button color='failure' onClick={handleDeleteMaterial}>
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

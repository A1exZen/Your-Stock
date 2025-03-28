import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import {
	Alert,
	Button,
	Checkbox,
	Dropdown,
	FileInput,
	FloatingLabel,
	Label,
	Select,
	Spinner,
	Table,
	TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../../../firebase.js';

import { CircularProgressbar } from 'react-circular-progressbar';

const CreateProduct = () => {
	const { currentUser } = useSelector(state => state.user);
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [userCustomers, setUserCustomers] = useState([]);
	const [userMaterials, setUserMaterials] = useState([]);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const [selectedMaterials, setSelectedMaterials] = useState({});

	const [totalPrice, setTotalPrice] = useState(0);
	const [availableMaterials, setAvailableMaterials] = useState({});

	const [productQuantity, setProductQuantity] = useState(1);

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError('Please select an image');
				return;
			}
			setImageUploadError(null);
			const storage = getStorage(app);
			const fileName = new Date().getTime() + '-' + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageUploadProgress(progress.toFixed(0));
				},
				() => {
					setImageUploadError('Image upload failed');
					setImageUploadProgress(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						setImageUploadProgress(null);
						setImageUploadError(null);
						setFormData({ ...formData, image: downloadURL });
					});
				}
			);
		} catch (error) {
			setImageUploadError('Image upload failed');
			setImageUploadProgress(null);
			console.log(error);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// Проверка наличия выбранных материалов
		const selectedMaterialIds = Object.keys(selectedMaterials);
		if (selectedMaterialIds.length === 0) {
			setPublishError('Please select materials for the product');
			return;
		}
		const requiredMaterials = [];
		selectedMaterialIds.forEach(materialId => {
			requiredMaterials.push({
				material: materialId,
				quantity: selectedMaterials[materialId] * productQuantity,
			});
		});
		const insufficientMaterials = requiredMaterials.filter(material => {
			return material.quantity > availableMaterials[material.material];
		});
		if (insufficientMaterials.length > 0) {
			const insufficientMaterialNames = insufficientMaterials.map(material => {
				const materialObj = userMaterials.find(
					m => m._id === material.material
				);
				return materialObj ? materialObj.name : '';
			});
			setPublishError(
				`Недостаточно следующих материалов: ${insufficientMaterialNames.join(
					', '
				)}`
			);
			return;
		}
		try {
			// Рассчет стоимости продукта и создание запроса для создания продукта
			const productData = {
				...formData,
				materials: requiredMaterials,
				price: totalPrice * productQuantity,
			};

			const requiredMaterialsObject = requiredMaterials.reduce((obj, item) => {
				obj[item.material] = item.quantity;
				return obj;
			}, {});

			const updateRes = await fetch(
				`/api/material/update-quantity/${currentUser._id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requiredMaterialsObject),
				}
			);
			if (!updateRes.ok) {
				const updateData = await updateRes.json();
				setPublishError(updateData.error);
				return;
			}
			const res = await fetch('/api/product/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productData),
			});
			const data = await res.json();
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}

			setPublishError(null);
			navigate(`/dashboard?tab=products`);
		} catch (error) {
			setPublishError(error);
		}
	};

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
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchCustomers();
		fetchMaterials();
	}, [currentUser._id]);

	useEffect(() => {
		const available = {};
		userMaterials.forEach(material => {
			available[material._id] = material.quantity;
		});
		setAvailableMaterials(available);
	}, [userMaterials]);

	const handleMaterialQuantityChange = (materialId, quantity) => {
		const updatedSelectedMaterials = {
			...selectedMaterials,
			[materialId]: quantity,
		};
		setSelectedMaterials(updatedSelectedMaterials);
		const updatedTotalPrice = Object.keys(updatedSelectedMaterials).reduce(
			(total, materialId) => {
				const material = userMaterials.find(
					material => material._id === materialId
				);
				return (
					total +
					(material ? material.price * updatedSelectedMaterials[materialId] : 0)
				);
			},
			0
		);
		setTotalPrice(updatedTotalPrice);
	};

	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-3xl my-7 font-semibold'>
				Добавить Продукт
			</h1>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='flex flex-col md:flex-row gap-4 relative'>
					<div className='flex flex-col gap-4 flex-2'>
						<TextInput
							type='text'
							placeholder='Название'
							required
							id='name'
							className='flex-1 '
							onChange={e => setFormData({ ...formData, name: e.target.value })}
						/>
						<div className='flex flex-wrap flex-col gap-4 sm:flex-row justify-between'>
							<Select
								onChange={e =>
									setFormData({ ...formData, customer: e.target.value })
								}
								className='flex-1'
							>
								<option value='uncategorized'>Выберите покупателя</option>
								{userCustomers.map(customer => (
									<option key={customer._id} value={customer._id}>
										{customer.name}
									</option>
								))}
							</Select>
							<TextInput
								type='number'
								placeholder='Кол-во'
								required
								id='quantity'
								value={productQuantity}
								onChange={e => setProductQuantity(parseInt(e.target.value))}
							/>
						</div>
						<div className='flex flex-wrap flex-col gap-4 sm:flex-row justify-between'>
							<textarea
								placeholder='описание'
								rows='3'
								required
								id='description'
								className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								onChange={e =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
						<div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
							<FileInput
								type='file'
								accept='image/*'
								onChange={e => setFile(e.target.files[0])}
							/>
							<Button
								type='button'
								gradientDuoTone='purpleToBlue'
								size='sm'
								outline
								onClick={handleUploadImage}
								disabled={imageUploadProgress}
							>
								{imageUploadProgress ? (
									<div className='w-16 h-16'>
										<CircularProgressbar
											value={imageUploadProgress}
											text={`${imageUploadProgress || 0}%`}
										/>
									</div>
								) : (
									'Загрузить картинку'
								)}
							</Button>
						</div>
						{imageUploadError && (
							<Alert color='failure'>{imageUploadError}</Alert>
						)}
						{formData.image && (
							<img
								src={formData.image}
								alt='upload'
								className='w-full h-72 object-cover'
							/>
						)}
					</div>
					<div className='flex-1 overflow-x-auto max-h-72'>
						{loading ? (
							<div className='flex justify-center'>
								<Spinner size='lg' />
							</div>
						) : (
							<Table hoverable>
								<Table.Head>
									<Table.HeadCell>Название</Table.HeadCell>
									<Table.HeadCell>Кол-во</Table.HeadCell>
								</Table.Head>
								<Table.Body className='divide-y'>
									{userMaterials.map(material => (
										<Table.Row
											key={material._id}
											className='bg-white dark:border-gray-700 dark:bg-gray-800'
										>
											<Table.Cell className='font-semibold'>
												{material.name}
											</Table.Cell>
											<Table.Cell>
												<input
													type='number'
													id='number-input'
													className=' border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
													placeholder='10'
													defaultValue='0'
													max={material.quantity}
													onChange={e =>
														handleMaterialQuantityChange(
															material._id,
															parseInt(e.target.value)
														)
													}
												/>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						)}
					</div>
				</div>
				<Button type='submit' color='blue'>
					Добавить
				</Button>
				{publishError && (
					<Alert className='mt-5' color='failure'>
						{' '}
						{publishError}{' '}
					</Alert>
				)}
			</form>
		</div>
	);
};

export default CreateProduct;

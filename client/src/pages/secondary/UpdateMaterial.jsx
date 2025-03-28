import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../../../firebase.js';

import { CircularProgressbar } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';

const UpdateMaterial = () => {
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [supplier, setSupplier] = useState({});
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const { materialId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useSelector(state => state.user);

	useEffect(() => {
		try {
			const fetchMaterial = async () => {
				const res = await fetch(
					`/api/material/get-all?materialId=${materialId}`
				);
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
					setPublishError(data.message);
					return;
				}
				if (res.ok) {
					setPublishError(data.message);
					setFormData(data.materials[0]);
				}
			};
			fetchMaterial();
		} catch (error) {
			console.log(error.message);
		}
	}, [materialId]);

	// useEffect(() => {
	// 	try {
	// 		const fetchSupplier = async () => {
	// 			const res = await fetch(`/api/supplier/get-one/${formData.supplier}`);
	// 			const data = await res.json();
	// 			if (!res.ok) {
	// 				console.log(data.message);
	// 				setPublishError(data.message);
	// 				return;
	// 			}
	// 			if (res.ok) {
	// 				setPublishError(data.message);
	// 				setSupplier(data.name);
	// 			}
	// 		};
	// 		fetchSupplier();
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// }, [formData]);

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
		console.log(formData);
		try {
			const res = await fetch(
				`/api/material/update/${formData._id}/${currentUser._id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await res.json();
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}
			if (res.ok) {
				setPublishError(null);
				navigate(`/dashboard?tab=materials`);
			}
		} catch (error) {
			setPublishError('Something went wrong');
		}
	};

	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-3xl my-7 font-semibold'>
				Обновить материал
			</h1>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<TextInput
					type='text'
					placeholder='Название'
					required
					id='name'
					className='flex-1'
					value={formData.name}
					onChange={e => setFormData({ ...formData, name: e.target.value })}
				/>
				<div className='flex flex-wrap flex-col gap-4 sm:flex-row justify-between'>
					<TextInput
						type='number'
						placeholder='Цена, ед.'
						required
						id='price'
						className='flex-1'
						value={formData.price}
						onChange={e => setFormData({ ...formData, price: e.target.value })}
					/>
					<TextInput
						type='text'
						placeholder='Ед. изм.'
						required
						id='unit'
						className='flex-1'
						value={formData.unit}
						onChange={e => setFormData({ ...formData, unit: e.target.value })}
					/>
					<Select disabled className='flex-1'>
						<option value='uncategorized'>{formData.supplier}</option>
					</Select>
				</div>
				<div className='flex flex-wrap flex-col gap-4 sm:flex-row justify-between'>
					<textarea
						placeholder='описание'
						rows='3'
						required
						id='description'
						value={formData.description}
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
				{imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
				{formData.image && (
					<img
						src={formData.image}
						alt='upload'
						className='w-full h-72 object-cover'
					/>
				)}
				<Button type='submit' gradientDuoTone='purpleToPink'>
					Обновить
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

export default UpdateMaterial;

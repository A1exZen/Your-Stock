import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../../components/OAuth.jsx';
import {
	loginFailure,
	loginStart,
	loginSuccess,
} from '../../redux/user/userSlice.js';

const Login = () => {
	const dispatch = useDispatch();
	const { loading, error: errorMessage } = useSelector(state => state.user);
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();

	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			return dispatch(loginFailure('Пожалуйста, заполните все поля'));
		}
		try {
			dispatch(loginStart());
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(loginFailure(data.message));
			}

			if (res.ok) {
				dispatch(loginSuccess(data));
				navigate('/');
			}
		} catch (error) {
			dispatch(loginFailure(error.message));
		}
	};

	return (
		<div className='min-h-screen mt-20'>
			<div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
				{/*left*/}
				<div className='flex-1'>
					<Link to='/' className='font-bold dark:text-white text-4xl'>
						Your
						<span className='ml-2 px-2 py-1 bg-gradient-to-r transition ease-in-out duration-200  from-indigo-500 to-blue-500 rounded-lg text-white animate-shine  hover:from-blue-500 hover:to-indigo-500'>
							Stock
						</span>
					</Link>
					<p className='text-md mt-5 mr-10'>
						Авторизируйтесь с помощь вашего логина и пароля, или с помощью
						аккаунта Google
					</p>
				</div>

				{/*	right*/}
				<div className='flex-1'>
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<div>
							<Label value='Ваш Email' />
							<TextInput
								type='email'
								placeholder='qwerty@gmail.com'
								id='email'
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value='Ваш Пароль' />
							<TextInput
								type='password'
								placeholder='********'
								id='password'
								onChange={handleChange}
							/>
						</div>
						<Button type='submit' color='blue' disabled={loading}>
							{loading ? (
								<>
									<Spinner size='sm' />
									<span className='pl-3'>Loading...</span>
								</>
							) : (
								'Авторизация'
							)}
						</Button>
						<OAuth />
					</form>
					<div className='flex gap-2 text-sm mt-5'>
						<span>Нет аккаунта?</span>
						<Link to='/register' className='text-blue-500'>
							Регистрация
						</Link>
					</div>
					{errorMessage && (
						<Alert className='mt-5' color='failure'>
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default Login;

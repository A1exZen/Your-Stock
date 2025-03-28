import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice.js';
import { signOutSuccess } from '../redux/user/userSlice.js';

export default function Header({ sidebarOpen, setSidebarOpen }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const path = useLocation().pathname;
	const { currentUser } = useSelector(state => state.user);
	const { theme } = useSelector(state => state.theme);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

	const handleSignOut = async () => {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST',
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signOutSuccess());
				navigate(`/login`);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set('searchTerm', searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	return (
		<Navbar className='sticky border-b-2'>
			<div className='flex'>
				{/* Hamburger button */}
				<button
					className=' text-gray-300 hover:text-gray-400 lg:hidden'
					aria-controls='sidebar'
					aria-expanded={sidebarOpen}
					onClick={e => {
						e.stopPropagation();
						setSidebarOpen(!sidebarOpen);
					}}
				>
					<HiOutlineMenuAlt1 className='w-7 h-7' />
				</button>
			</div>
			{/* <Link
				to='/'
				className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
			>
				Your
				<span className='ml-0.5 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
					Stock
				</span>
			</Link> */}
			<form onSubmit={handleSubmit}>
				<TextInput
					type='text'
					placeholder='Поиск...'
					rightIcon={AiOutlineSearch}
					className='hidden lg:inline'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</form>
			<Button className='w-12 h-10 lg:hidden' color='gray' pill>
				<AiOutlineSearch />
			</Button>
			<div className='flex gap-2 md:order-2'>
				<Button
					className='w-12 h-10 hidden sm:inline'
					color='gray'
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === 'light' ? <FaSun /> : <FaMoon />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar alt='user' img={currentUser.profilePicture} rounded />
						}
					>
						<Dropdown.Header>
							<span className='block text-sm'>@{currentUser.username}</span>
							<span className='block text-sm font-medium truncate'>
								@{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={'/dashboard?tab=profile'}>
							<Dropdown.Item>Профиль</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignOut}>Выход</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to='/login'>
						<Button color='blue' outline>
							Войти
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === '/'} as={'div'}>
					<Link to='/'>Возможности</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/about'} as={'div'}>
					<Link to='/about'>О нас</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}

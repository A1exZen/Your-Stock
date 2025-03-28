import { Footer } from 'flowbite-react';
import {
	BsDribbble,
	BsFacebook,
	BsGithub,
	BsInstagram,
	BsTwitter,
} from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
const FooterComp = () => {
	return (
		<Footer container className='border-t-2 border-t-cyan-700'>
			<div className='w-full px-10 text-center'>
				<div className='w-full justify-between sm:flex sm:items-center sm:justify-between'>
					<NavLink
						to='/'
						className=' flex items-center text-sm sm:text-xl font-semibold dark:text-white'
					>
						Your
						<span className='ml-1 px-2 py-1 bg-gradient-to-r transition ease-in-out duration-200  from-indigo-500 to-blue-500 rounded-lg text-white animate-shine  hover:from-blue-500 hover:to-indigo-500'>
							Stock
						</span>
					</NavLink>
					<Footer.LinkGroup>
						<Footer.Link href='/'>Возможности</Footer.Link>
						<Footer.Link href='/about'>О нас</Footer.Link>
						<Footer.Link href='#'>Контакты</Footer.Link>
						<Footer.Link href='#'>Privacy Policy</Footer.Link>
					</Footer.LinkGroup>
				</div>
				<Footer.Divider className='lg:my-5 my-2' />
				<Footer.Copyright by='Alexey Zenchik' year={2024} />
			</div>
		</Footer>
	);
};

export default FooterComp;

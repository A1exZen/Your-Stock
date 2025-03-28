import { Button, Card, Carousel, Rating } from 'flowbite-react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import users from '../../static/users.json';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<main>
			<section className='pt-16 md:pb-10 pb-0'>
				<div className='max-w-5xl md:flex mx-auto'>
					<div className='flex-1'>
						<h1 className='font-black text-4xl sm:text-5xl'>
							Склад, производство, торговля в одной системе
						</h1>
						<p className='text-lg md:text-xl max-w-sm mt-5 md:mt-10'>
							Your Stock - онлайн-сервис учета продукции для вашего производства
						</p>
						<Link to='/register'>
							<Button
								href='/register'
								color='blue'
								className='mt-10 max-w-xs rounded-md'
							>
								Начать работу
							</Button>
						</Link>
					</div>
					<div className='flex-1 '>
						<img
							className='xl:translate-y-[-5rem]'
							src='../../../public/finance-app.svg'
						/>
					</div>
				</div>
			</section>
			<section className='px-5 pb-32'>
				<h1 className='font-extrabold text-3xl sm:text-4xl text-center pb-10'>
					Кому выгодно
				</h1>
				<div className='flex flex-row justify-center flex-wrap gap-7'>
					<Card href='#' className='w-52 h-40 items-center'>
						<div className='mx-auto'>
							<img className='w-20' src='../../../public/production.svg' />
						</div>
						<p className='font-bold text-center'>Производству</p>
					</Card>
					<Card href='#' className='w-52 h-40 items-center'>
						<div className='mx-auto'>
							<img
								className='w-20'
								src='../../../public/shopping-cart-43.svg'
							/>
						</div>
						<p className='font-bold text-center'>Оптовой торговле</p>
					</Card>
					<Card href='#' className='w-52 h-40 items-center'>
						<div className='mx-auto'>
							<img
								className='w-20'
								src='../../../public/order-confirmed-1-76.svg'
							/>
						</div>
						<p className='font-bold text-center'>Оптовой торговле</p>
					</Card>
					<Card href='#' className='w-52 h-40 items-center'>
						<div className='mx-auto'>
							<img className='w-20' src='../../../public/online-store-10.svg' />
						</div>
						<p className='font-bold text-center'>Онлайн-торговле</p>
					</Card>
				</div>
			</section>
			<section className='px-5 pb-32'>
				<Card href='#' className='w-full h-80 items-center'>
					<div className='flex flex-row items-center justify-center gap-24'>
						<img
							className='w-64 h-64'
							src='../../../public/data-maintenance-8.svg'
							alt='image'
						/>
						<div className='flex flex-col items-center gap-7'>
							<h1 className='font-extrabold text-3xl sm:text-4xl  '>
								Начните прямо сейчас!
							</h1>
							<Link to='register'>
								<Button color='blue' className='max-w-xs rounded-md '>
									Бесплатная версия
								</Button>
							</Link>
						</div>
						<img
							className='w-64 h-64'
							src='../../../public/financial-statement-54.svg'
							alt='image'
						/>
					</div>
				</Card>
			</section>
			<section className='px-5 '>
				<h1 className='font-extrabold text-3xl sm:text-4xl text-center pb-5'>
					Отзывы пользователей
				</h1>
				<div className='max-w-5xl mx-auto mt-5'>
					<div className='h-80 xl:h-48'>
						<Carousel
							leftControl={<MdArrowBackIos className='w-7 h-7 ' />}
							rightControl={<MdArrowForwardIos className='w-7 h-7' />}
							pauseOnHover
							slide={false}
						>
							{users.map((user, index) => (
								<div
									className='flex xl:flex-row flex-col items-center justify-center px-24 lg:px-28 pb-10 '
									key={index}
								>
									<div className='flex-2 flex flex-col items-center mr-10'>
										<img
											className='w-16 h-16 rounded-full mb-2'
											src={user.avatar}
											alt={user.name}
										/>
										<h2 className='font-bold'>{user.name}</h2>
										<p className='text-xs font-light mb-2'>{user.profession}</p>
										<Rating>
											{[...Array(user.stars)].map((star, i) => (
												<Rating.Star key={i} active />
											))}
										</Rating>
									</div>
									<div className='flex-1 text-center mt-3 xl:mt-0'>
										{user.comment}
									</div>
								</div>
							))}
						</Carousel>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Home;

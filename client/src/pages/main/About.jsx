import { useEffect, useState } from 'react';
import ComingSoon from './../secondary/ComingSoon';
const About = () => {
	const [recentSupplier, setRecentSupplier] = useState(null);

	// useEffect(() => {
	// 	try {
	// 		const fetchRecentSuppliers = async () => {
	// 			const res = await fetch(`/api/supplier/get-suppliers?limit=3`);
	// 			const data = await res.json();
	// 			if (res.ok) {
	// 				setRecentSupplier(data.suppliers);
	// 			}
	// 		};
	// 		fetchRecentSuppliers();
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// }, []);

	return (
		<div className='flex flex-col justify-center items-center mb-5'>
			<ComingSoon />
			{/* <h1 className='text-xl mt-5'>Recent articles</h1>
			<div className='flex flex-wrap gap-5 mt-5 justify-center'>
				{recentSupplier &&
					recentSupplier.map(supplier => (
						<div key={supplier._id}>{supplier.name}</div>
					))}
			</div> */}
		</div>
	);
};

export default About;

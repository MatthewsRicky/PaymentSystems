import React from 'react'
import Link from "next/link";

const Navbar = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link href='/'>Login
						Home
					</Link>
				</li>
				<li>
					<Link href ="/about">
						About
					</Link>
				</li>
				<li>
					<Link href="/services">
						Services
					</Link>
				</li>
				<li>
					<Link href="/payment">
						payment
				</Link>
				</li>
			</ul>
		</nav>
	)
}
export default Navbar

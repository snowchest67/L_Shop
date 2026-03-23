import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header() {
	const { isAuthenticated, user, cartItemsCount, logout } = useApp()

	return (
		<header>
			<div className='container header-content'>
				<div className='logo'>
					<Link to='/'>BeautyShop</Link>
				</div>

				<nav>
					<ul>
						<li>
							<NavLink to='/' end>
								Главная
							</NavLink>
						</li>
						{isAuthenticated ? (
							<>
								<li>
									<NavLink to='/cart' className='cart-link'>
										Корзина
										<span id='cart-counter'>{cartItemsCount}</span>
									</NavLink>
								</li>
								<li>
									<NavLink to='/orders'>Мои заказы</NavLink>
								</li>
								<li>
									<button className='btn btn-link' onClick={logout}>
										Выход
									</button>
								</li>
								<li id='user-greeting'>Привет, {user?.name}</li>
							</>
						) : (
							<li>
								<NavLink to='/auth'>Вход</NavLink>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	)
}

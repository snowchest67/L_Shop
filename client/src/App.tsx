import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Header from '../src/components/Header'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import CartPage from './pages/CartPage'
import DeliveryPage from './pages/DeliveryPage'
import OrdersPage from './pages/OrdersPage'

function RequireAuth({ children }: { children: JSX.Element }) {
	const { isAuthenticated } = useApp()
	if (!isAuthenticated) {
		return <Navigate to='/auth' replace />
	}
	return children
}

function AppRoutes() {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='/auth' element={<AuthPage />} />
			<Route
				path='/cart'
				element={
					<RequireAuth>
						<CartPage />
					</RequireAuth>
				}
			/>
			<Route
				path='/delivery'
				element={
					<RequireAuth>
						<DeliveryPage />
					</RequireAuth>
				}
			/>
			<Route
				path='/orders'
				element={
					<RequireAuth>
						<OrdersPage />
					</RequireAuth>
				}
			/>
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	)
}

export default function App() {
	return (
		<AppProvider>
			<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Header />
				<main className='container' style={{ flex: 1 }}>
					<AppRoutes />
				</main>
				<footer>
					<div className='container'>
						<div>
							<p style={{marginBottom: '0.5rem'}}>&copy; BeautyShop</p>
							<p style={{fontSize: '0.9rem', color: '#999'}}>
								Делали: Тимофей, Злата, Аня, Полина
								<br />
								<span style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff'}}>10</span>
							</p>
						</div>
					</div>
				</footer>
			</div>
		</AppProvider>
	)
}

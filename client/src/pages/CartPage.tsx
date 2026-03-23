import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartAPI } from '../api/cart'
import { CartWithDetails } from '../types'
import { useApp } from '../contexts/AppContext'

export default function CartPage() {
	const [cart, setCart] = useState<CartWithDetails | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { refreshState } = useApp()
	const navigate = useNavigate()

	const loadCart = async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await cartAPI.getCart()
			setCart(data)
		} catch (err) {
			console.error(err)
			setError('Не удалось загрузить корзину')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCart()
	}, [])

	const updateQuantity = async (productId: string, quantity: number) => {
		try {
			await cartAPI.updateCartItem(productId, quantity)
			await refreshState()
			await loadCart()
		} catch (err) {
			console.error(err)
			alert('Не удалось обновить количество')
		}
	}

	const removeItem = async (productId: string) => {
		if (!confirm('Удалить товар из корзины?')) return

		try {
			await cartAPI.removeFromCart(productId)
			await refreshState()
			await loadCart()
		} catch (err) {
			console.error(err)
			alert('Не удалось удалить товар')
		}
	}

	const clearCart = async () => {
		if (!confirm('Очистить корзину?')) return

		try {
			await cartAPI.clearCart()
			await refreshState()
			await loadCart()
		} catch (err) {
			console.error(err)
			alert('Не удалось очистить корзину')
		}
	}

	if (loading) {
		return <p>Загрузка корзины...</p>
	}

	if (error) {
		return <p className='text-error'>{error}</p>
	}

	if (!cart || cart.items.length === 0) {
		return (
			<div className='cart-empty'>
				<h2>Корзина пуста</h2>
				<p>
					Перейдите в <a href='/'>каталог</a>, чтобы добавить товары
				</p>
			</div>
		)
	}

	return (
		<div>
			<h1>Корзина</h1>

			<div className='cart-items'>
				{cart.items.map(item => (
					<div className='cart-item' key={item.productId}>
						<div className='cart-item-info'>
							<h3 className='cart-item-title'>{item.product.name}</h3>
							<p className='cart-item-price'>
								{item.product.price.toLocaleString()} BYN
							</p>
						</div>

						<div className='cart-item-quantity'>
							<button
								className='btn btn-secondary'
								disabled={item.quantity <= 1}
								onClick={() =>
									updateQuantity(item.productId, item.quantity - 1)
								}
							>
								-
							</button>
							<span className='quantity'>{item.quantity}</span>
							<button
								className='btn btn-secondary'
								onClick={() =>
									updateQuantity(item.productId, item.quantity + 1)
								}
							>
								+
							</button>
						</div>

						<div className='cart-item-total'>
							{(item.product.price * item.quantity).toLocaleString()} BYN
						</div>

						<button
							className='btn btn-danger'
							onClick={() => removeItem(item.productId)}
						>
							×
						</button>
					</div>
				))}
			</div>

			<div className='cart-summary'>
				<div className='cart-total'>
					<span>Итого:</span>
					<span className='total-price'>
						{cart.totalPrice.toLocaleString()} BYN
					</span>
				</div>
				<div className='cart-total-items'>
					<span>Товаров:</span>
					<span>{cart.totalItems} шт.</span>
				</div>

				<div className='cart-actions'>
					<button className='btn btn-secondary' onClick={clearCart}>
						Очистить корзину
					</button>
					<button
						className='btn btn-primary'
						onClick={() => navigate('/delivery')}
					>
						Оформить заказ
					</button>
				</div>
			</div>
		</div>
	)
}

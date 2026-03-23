import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartAPI } from '../api/cart'
import { deliveryAPI } from '../api/delivery'
import { DeliveryInfo } from '../types'
import { useApp } from '../contexts/AppContext'

export default function DeliveryPage() {
	const [cartEmpty, setCartEmpty] = useState(false)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
		address: '',
		phone: '',
		email: '',
		paymentMethod: 'card',
	})

	const [cart, setCart] = useState<any>(null)
	const { refreshState } = useApp()
	const navigate = useNavigate()

	useEffect(() => {
		async function checkCart() {
			setLoading(true)
			try {
				const cartData = await cartAPI.getCart()
				setCart(cartData)
				setCartEmpty(cartData.items.length === 0)
			} catch (err) {
				console.error(err)
				setError('Не удалось получить корзину')
			} finally {
				setLoading(false)
			}
		}

		checkCart()
	}, [])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setSubmitting(true)
		setError(null)

		try {
			await deliveryAPI.createDelivery(deliveryInfo)
			await refreshState()
			alert('Доставка успешно оформлена!')
			navigate('/orders')
		} catch (err) {
			console.error(err)
			setError('Ошибка при оформлении доставки. Пожалуйста, попробуйте снова.')
		} finally {
			setSubmitting(false)
		}
	}

	if (loading) {
		return <div className='container'><p className='text-center'>Загрузка...</p></div>
	}

	if (cartEmpty) {
		return (
			<div className='container'>
				<div className='cart-empty'>
					<h2>Корзина пуста</h2>
					<p>Добавьте товары, чтобы продолжить оформление доставки.</p>
					<p>
						<a href='/'>Вернуться в каталог</a>
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='container'>
			<div className='delivery-container'>
				<h1>Оформление доставки</h1>
				{error && <p className='text-error'>{error}</p>}
					{cart && cart.items.length > 0 && (
						<div style={{marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
							<h2 style={{marginBottom: '1rem'}}>Ваш заказ</h2>
							{cart.items.map((item: any) => (
								<div key={item.productId} style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd', marginBottom: '0.5rem'}}>
									<div>
										<strong>{item.product.name}</strong>
										<div style={{fontSize: '0.9rem', color: '#666'}}>{item.quantity} шт.</div>
									</div>
									<div style={{textAlign: 'right'}}>
										<div>{(item.product.price * item.quantity).toLocaleString()} BYN</div>
									</div>
								</div>
							))}
							<div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #999', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
								<span>Итого:</span>
								<span>{cart.totalPrice.toLocaleString()} BYN</span>
							</div>
						</div>
					)}
				<form className='delivery-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='address'>Адрес доставки</label>
						<input
							id='address'
							name='address'
							placeholder='Улица, дом, квартира'
							required
							value={deliveryInfo.address}
							onChange={e =>
								setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
							}
						/>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='phone'>Телефон</label>
							<input
								id='phone'
								name='phone'
								type='tel'
								placeholder='+375 (29) 000 00 00'
								required
								value={deliveryInfo.phone}
								onChange={e =>
									setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
								}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								id='email'
								name='email'
								type='email'
								placeholder='example@email.com'
								required
								value={deliveryInfo.email}
								onChange={e =>
									setDeliveryInfo({ ...deliveryInfo, email: e.target.value })
								}
							/>
						</div>
					</div>

					<div className='form-group'>
						<label htmlFor='payment'>Способ оплаты</label>
						<select
							id='payment'
							name='paymentMethod'
							required
							value={deliveryInfo.paymentMethod}
							onChange={e =>
								setDeliveryInfo({
									...deliveryInfo,
									paymentMethod: e.target.value as DeliveryInfo['paymentMethod'],
								})
							}
						>
							<option value='card'>Карта</option>
							<option value='cash'>Наличные</option>
							<option value='online'>Онлайн</option>
						</select>
					</div>

					<button className='btn btn-primary btn-large btn-block' type='submit' disabled={submitting}>
						{submitting ? 'Оформление...' : 'Оформить доставку'}
					</button>
				</form>
			</div>
		</div>
	)
}

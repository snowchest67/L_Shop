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

	const { refreshState } = useApp()
	const navigate = useNavigate()

	useEffect(() => {
		async function checkCart() {
			setLoading(true)
			try {
				const cart = await cartAPI.getCart()
				setCartEmpty(cart.items.length === 0)
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
		return <p>Загрузка...</p>
	}

	if (cartEmpty) {
		return (
			<div className='cart-empty'>
				<h2>Корзина пуста</h2>
				<p>Добавьте товары, чтобы продолжить оформление доставки.</p>
				<p>
					<a href='/'>Вернуться в каталог</a>
				</p>
			</div>
		)
	}

	return (
		<div className='delivery-page'>
			<h1>Оформление доставки</h1>
			{error && <p className='text-error'>{error}</p>}

			<form className='delivery-form' onSubmit={handleSubmit}>
				<div className='form-group'>
					<label htmlFor='address'>Адрес доставки</label>
					<input
						id='address'
						name='address'
						required
						value={deliveryInfo.address}
						onChange={e =>
							setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
						}
					/>
				</div>

				<div className='form-group'>
					<label htmlFor='phone'>Телефон</label>
					<input
						id='phone'
						name='phone'
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
						required
						value={deliveryInfo.email}
						onChange={e =>
							setDeliveryInfo({ ...deliveryInfo, email: e.target.value })
						}
					/>
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
						<option value='card'>Картой</option>
						<option value='cash'>Наличными</option>
						<option value='online'>Онлайн</option>
					</select>
				</div>

				<button className='btn btn-primary' type='submit' disabled={submitting}>
					{submitting ? 'Оформление...' : 'Оформить доставку'}
				</button>
			</form>
		</div>
	)
}

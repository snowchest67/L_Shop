import { useEffect, useState } from 'react'
import { deliveryAPI } from '../api/delivery'
import { Order } from '../types'

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadOrders = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await deliveryAPI.getOrders()
				setOrders(response.orders || [])
			} catch (err) {
				console.error(err)
				setError('Ошибка при загрузке заказов')
			} finally {
				setLoading(false)
			}
		}

		loadOrders()
	}, [])

	if (loading) {
		return <p>Загрузка заказов...</p>
	}

	if (error) {
		return <p className='text-error'>{error}</p>
	}

	if (orders.length === 0) {
		return (
			<div className='cart-empty'>
				<h2>У вас еще нет заказов</h2>
				<p>Добавьте товары в корзину и оформите доставку.</p>
				<p>
					<a href='/'>Перейти в каталог</a>
				</p>
			</div>
		)
	}

	return (
		<div>
			<h1>Мои заказы</h1>

			<div className='orders'>
				{orders.map(order => (
					<div className='order-card' key={order.id}>
						<div className='order-header'>
							<div>
								<strong>Заказ:</strong> {order.id}
							</div>
							<div>
								<strong>Дата:</strong>{' '}
								{new Date(order.createdAt).toLocaleString()}
							</div>
							<div>
								<strong>Статус:</strong> {order.status}
							</div>
						</div>

						<div className='order-delivery'>
							<h3>Информация по доставке</h3>
							<div>
								<strong>Адрес:</strong> {order.deliveryInfo.address}
							</div>
							<div>
								<strong>Телефон:</strong> {order.deliveryInfo.phone}
							</div>
							<div>
								<strong>Email:</strong> {order.deliveryInfo.email}
							</div>
							<div>
								<strong>Оплата:</strong> {order.deliveryInfo.paymentMethod}
							</div>
						</div>

						<div className='order-items'>
							{order.items.map(item => (
								<div className='order-item' key={item.productId}>
									<div className='order-item-name'>{item.productId}</div>
									<div className='order-item-qty'>{item.quantity} шт.</div>
									<div className='order-item-price'>
										{item.unitPrice.toLocaleString()} BYN
									</div>
								</div>
							))}
						</div>

						<div className='order-total'>
							<strong>Итого:</strong> {order.totalPrice.toLocaleString()} BYN
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

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
		return <div className='container'><p className='text-center'>Загрузка заказов...</p></div>
	}

	if (error) {
		return <div className='container'><p className='text-error'>{error}</p></div>
	}

	if (orders.length === 0) {
		return (
			<div className='container'>
				<div className='no-orders'>
					<h2>У вас еще нет заказов</h2>
					<p>Добавьте товары в корзину и оформите доставку.</p>
					<a href='/' className='btn btn-primary'>Перейти в каталог</a>
				</div>
			</div>
		)
	}

	return (
		<div className='container'>
			<div className='orders-container'>
				<h1>Мои заказы</h1>

				<div className='orders-list'>
					{orders.map(order => (
						<div className='order-card' key={order.id}>
							<div className='order-header'>
								<div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
									<div>
										<div className='order-id'>Заказ #{order.id}</div>
									</div>
									<span className={`order-status ${order.status.toLowerCase()}`}>
										{order.status}
									</span>
								</div>
								<div className='order-detail-value' style={{textAlign: 'right'}}>
									{new Date(order.createdAt).toLocaleString('ru-RU')}
								</div>
							</div>

							<div className='order-details'>
								<div className='order-detail-item'>
									<div className='order-detail-label'>Адрес</div>
									<div className='order-detail-value'>{order.deliveryInfo.address}</div>
								</div>
								<div className='order-detail-item'>
									<div className='order-detail-label'>Телефон</div>
									<div className='order-detail-value'>{order.deliveryInfo.phone}</div>
								</div>
								<div className='order-detail-item'>
									<div className='order-detail-label'>Email</div>
									<div className='order-detail-value'>{order.deliveryInfo.email}</div>
								</div>
								<div className='order-detail-item'>
									<div className='order-detail-label'>Оплата</div>
									<div className='order-detail-value'>{order.deliveryInfo.paymentMethod}</div>
								</div>
							</div>

							<div className='order-items'>
								{order.items.map(item => (
									<div className='order-item' key={item.productId}>
										<div><strong>{item.productName}</strong></div>
										<div>{item.quantity} шт. × {item.unitPrice.toLocaleString()} BYN</div>
									</div>
								))}
							</div>

							<div style={{textAlign: 'right', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', marginTop: '1rem', fontWeight: 700, color: '#1a1a1a'}}>
								<strong>Итого:</strong> {order.totalPrice.toLocaleString()} BYN
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

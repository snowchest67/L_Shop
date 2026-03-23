import { useState } from 'react'
import { Product } from '../types'
import { cartAPI } from '../api/cart'
import { useApp } from '../contexts/AppContext'

interface ProductCardProps {
	product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
	const { isAuthenticated, refreshState } = useApp()
	const [quantity, setQuantity] = useState(1)
	const [loading, setLoading] = useState(false)

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			window.location.href = '/auth'
			return
		}

		setLoading(true)
		try {
			await cartAPI.addToCart(product.id, quantity)
			await refreshState()
			alert('Товар добавлен в корзину')
		} catch (error) {
			console.error(error)
			alert('Не удалось добавить товар в корзину')
		} finally {
			setLoading(false)
		}
	}

	return (
		<article className='product-card'>
			<div className='product-content'>
				<h3 className='product-title'>{product.name}</h3>
				<p className='product-description'>{product.description}</p>
			</div>

			<div className='product-footer'>
				<div className='product-price'>{product.price.toLocaleString()} BYN</div>

				<div className='product-quantity'>
					<button
						className='qty-btn'
						type='button'
						onClick={() => setQuantity(q => Math.max(1, q - 1))}
					>
						−
					</button>
					<input
						className='qty-input'
						type='number'
						min={1}
						value={quantity}
						onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))}
					/>
					<button
						className='qty-btn'
						type='button'
						onClick={() => setQuantity(q => q + 1)}
					>
						+
					</button>
				</div>

				<button
					className='btn btn-primary'
					type='button'
					disabled={!product.inStock || loading}
					onClick={handleAddToCart}
				>
					{product.inStock
						? loading
							? 'Добавляю...'
							: 'В корзину'
						: 'Нет в наличии'}
				</button>
			</div>
		</article>
	)
}

import { useEffect, useState } from 'react'
import { productsAPI } from '../api/products'
import { Product } from '../types'
import Filters, { FilterState } from '../components/Filters'
import ProductCard from '../components/ProductCard'

const initialFilters: FilterState = {
	search: '',
	category: '',
	inStock: '',
	sort: undefined,
}

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>([])
	const [filters, setFilters] = useState<FilterState>(initialFilters)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loadProducts = async (params: FilterState) => {
		setLoading(true)
		setError(null)
		try {
			const response = await productsAPI.getProducts({
				search: params.search,
				category: params.category,
				inStock: params.inStock,
				sort: params.sort,
			})
			setProducts(response.products)
		} catch (err) {
			console.error(err)
			setError('Не удалось загрузить товары')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadProducts(filters)
	}, [filters])

	return (
		<div className='container'>
			<h1>Каталог косметики</h1>

			<Filters value={filters} onChange={setFilters} />

			{loading && <p className='text-center'>Загрузка товаров...</p>}
			{error && <p className='text-error'>{error}</p>}

			{!loading && !error && products.length === 0 && (
				<p className='no-products'>Товары не найдены</p>
			)}

			{!loading && !error && products.length > 0 && (
				<>
					<p className='products-count'>Найдено товаров: {products.length}</p>
					<div className='products-grid'>
						{products.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</>
			)}
		</div>
	)
}

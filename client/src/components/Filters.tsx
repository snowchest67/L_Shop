import { useEffect, useState } from 'react'
import { productsAPI } from '../api/products'
import { ProductQueryParams } from '../types'

export interface FilterState {
	search: string
	category: string
	inStock: string
	sort: ProductQueryParams['sort']
}

interface FiltersProps {
	value: FilterState
	onChange: (next: FilterState) => void
}

export default function Filters({ value, onChange }: FiltersProps) {
	const [categories, setCategories] = useState<string[]>([])

	useEffect(() => {
		productsAPI.getCategories().then(setCategories).catch(console.error)
	}, [])

	return (
		<section className='filters'>
			<div className='filter-group'>
				<input
					className='filter-search'
					type='text'
					placeholder='Поиск товаров...'
					value={value.search}
					onChange={e => onChange({ ...value, search: e.target.value })}
				/>
			</div>

			<div className='filter-group'>
				<select
					className='filter-category'
					value={value.category}
					onChange={e => onChange({ ...value, category: e.target.value })}
				>
					<option value=''>Все категории</option>
					{categories.map(cat => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			<div className='filter-group'>
				<select
					className='filter-stock'
					value={value.inStock}
					onChange={e => onChange({ ...value, inStock: e.target.value })}
				>
					<option value=''>Все товары</option>
					<option value='true'>В наличии</option>
					<option value='false'>Нет в наличии</option>
				</select>
			</div>

			<div className='filter-group'>
				<select
					className='filter-sort'
					value={value.sort || ''}
					onChange={e =>
						onChange({
							...value,
							sort: (e.target.value as ProductQueryParams['sort']) || undefined,
						})
					}
				>
					<option value=''>Без сортировки</option>
					<option value='price_asc'>Цена (по возрастанию)</option>
					<option value='price_desc'>Цена (по убыванию)</option>
					<option value='name_asc'>Название (А-Я)</option>
					<option value='name_desc'>Название (Я-А)</option>
				</select>
			</div>
		</section>
	)
}

import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AuthRequest } from '../middleware/authMiddleware'
import { readJSONFile, writeJSONFile } from '../utils/fileUtils'
import { Cart } from '../types/cart'
import { Order } from '../types/order'
import { Product } from '../types/product'

export const createOrder = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.userId
		if (!userId) {
			return res.status(401).json({ error: 'Требуется авторизация' })
		}

		const { address, phone, email, paymentMethod } = req.body

		if (!address || !phone || !email || !paymentMethod) {
			return res.status(400).json({ error: 'Все поля доставки обязательны' })
		}

		const carts = await readJSONFile<Cart>('carts.json')
		const cartIndex = carts.findIndex(c => c.userId === userId)

		if (cartIndex === -1 || carts[cartIndex].items.length === 0) {
			return res.status(400).json({ error: 'В корзине нет товаров' })
		}

		const products = await readJSONFile<Product>('products.json')

		const cart = carts[cartIndex]

		const items = cart.items.map(item => {
			const product = products.find(p => p.id === item.productId)
			return {
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: product?.price ?? 0,
			}
		})

		const totalPrice = items.reduce(
			(sum, item) => sum + item.unitPrice * item.quantity,
			0,
		)

		const orders = await readJSONFile<Order>('orders.json')

		const newOrder: Order = {
			id: uuidv4(),
			userId,
			items,
			deliveryInfo: {
				address,
				phone,
				email,
				paymentMethod,
			},
			totalPrice,
			status: 'pending',
			createdAt: new Date().toISOString(),
		}

		orders.push(newOrder)
		await writeJSONFile('orders.json', orders)

		carts[cartIndex].items = []
		carts[cartIndex].updatedAt = new Date().toISOString()
		await writeJSONFile('carts.json', carts)

		res.status(201).json({ order: newOrder })
	} catch (error) {
		console.error('Create order error:', error)
		res.status(500).json({ error: 'Ошибка при оформлении доставки' })
	}
}

export const getUserOrders = async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.userId
		if (!userId) {
			return res.status(401).json({ error: 'Требуется авторизация' })
		}

		const orders = await readJSONFile<Order>('orders.json')
		const userOrders = orders.filter(o => o.userId === userId)

		res.json({ orders: userOrders })
	} catch (error) {
		console.error('Get orders error:', error)
		res.status(500).json({ error: 'Ошибка при получении заказов' })
	}
}

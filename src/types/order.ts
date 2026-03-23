export type PaymentMethod = 'card' | 'cash' | 'online'

export interface DeliveryInfo {
	address: string
	phone: string
	email: string
	paymentMethod: PaymentMethod
}

export interface OrderItem {
	productId: string
	productName: string
	quantity: number
	unitPrice: number
}

export interface Order {
	id: string
	userId: string
	items: OrderItem[]
	deliveryInfo: DeliveryInfo
	totalPrice: number
	status: 'pending' | 'completed'
	createdAt: string
}

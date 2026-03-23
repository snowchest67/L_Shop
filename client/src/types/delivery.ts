import { ApiClient } from './client'
import { DeliveryInfo, Order } from '../types'

export class DeliveryAPI extends ApiClient {
	async createDelivery(data: DeliveryInfo): Promise<{ order: Order }> {
		return this.post('/delivery', data)
	}

	async getOrders(): Promise<{ orders: Order[] }> {
		return this.get('/delivery')
	}
}

export const deliveryAPI = new DeliveryAPI()

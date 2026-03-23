import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { User } from '../types'
import { authAPI } from '../api/auth'
import { cartAPI } from '../api/cart'

export interface AppState {
	user: User | null
	isAuthenticated: boolean
	cartItemsCount: number
}

export interface AppContextValue extends AppState {
	refreshState: () => Promise<void>
	logout: () => Promise<void>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function useApp() {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error('useApp must be used within AppProvider')
	}
	return context
}

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [cartItemsCount, setCartItemsCount] = useState(0)

	const refreshState = async () => {
		try {
			const isAuth = await cartAPI.checkAuth().catch(() => false)
			setIsAuthenticated(isAuth)

			if (!isAuth) {
				setUser(null)
				setCartItemsCount(0)
				return
			}

			const { user } = await authAPI.getCurrentUser()
			setUser(user)

			const cart = await cartAPI.getCart()
			setCartItemsCount(cart.totalItems)
		} catch (error) {
			setIsAuthenticated(false)
			setUser(null)
			setCartItemsCount(0)
		}
	}

	useEffect(() => {
		refreshState()
	}, [])

	const logout = async () => {
		await authAPI.logout().catch(() => {})
		await refreshState()
	}

	const value = useMemo(
		() => ({
			user,
			isAuthenticated,
			cartItemsCount,
			refreshState,
			logout,
		}),
		[user, isAuthenticated, cartItemsCount],
	)

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

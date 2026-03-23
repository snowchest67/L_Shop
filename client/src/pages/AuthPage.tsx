import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/auth'
import { useApp } from '../contexts/AppContext'

export default function AuthPage() {
	const [mode, setMode] = useState<'login' | 'register'>('login')
	const [form, setForm] = useState({
		name: '',
		email: '',
		login: '',
		phone: '',
		password: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { refreshState } = useApp()
	const navigate = useNavigate()

	const handleChange = (field: string, value: string) => {
		setForm(prev => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setError(null)

		try {
			if (mode === 'login') {
				await authAPI.login(form.login || form.email, form.password)
			} else {
				await authAPI.register({
					name: form.name,
					email: form.email,
					login: form.login,
					phone: form.phone,
					password: form.password,
				})
			}

			await refreshState()
			navigate('/')
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Ошибка при авторизации'
			console.error(err)
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='container'>
			<div className='auth-page'>
				<div className='auth-container'>
					<div className='auth-tabs'>
						<button
							className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
							type='button'
							onClick={() => setMode('login')}
						>
							Вход
						</button>
						<button
							className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
							type='button'
							onClick={() => setMode('register')}
						>
							Регистрация
						</button>
					</div>

					<form className='auth-form' onSubmit={handleSubmit}>
						{mode === 'register' && (
							<>
								<div className='form-group'>
									<label htmlFor='name'>Полное имя</label>
									<input
										id='name'
										placeholder='Иван Иванов'
										value={form.name}
										onChange={e => handleChange('name', e.target.value)}
										required
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='phone'>Телефон</label>
									<input
										id='phone'
										type='tel'
										placeholder='+375 (29) 000 00 00'
										value={form.phone}
										onChange={e => handleChange('phone', e.target.value)}
										required
									/>
								</div>
							</>
						)}

						<div className='form-group'>
							<label htmlFor='login'>Логин / Email</label>
							<input
								id='login'
								placeholder={mode === 'login' ? 'example@email.com' : 'Ваш логин'}
								value={form.login}
								onChange={e => handleChange('login', e.target.value)}
								required
							/>
						</div>

						{mode === 'register' && (
							<div className='form-group'>
								<label htmlFor='email'>Email</label>
								<input
									id='email'
									type='email'
									placeholder='example@email.com'
									value={form.email}
									onChange={e => handleChange('email', e.target.value)}
									required
								/>
							</div>
						)}

						<div className='form-group'>
							<label htmlFor='password'>Пароль</label>
							<input
								id='password'
								type='password'
								placeholder='Минимум 6 символов'
								value={form.password}
								onChange={e => handleChange('password', e.target.value)}
								required
							/>
						</div>

						{error && <p className='text-error'>{error}</p>}

						<button className='btn btn-primary btn-block btn-large' type='submit' disabled={loading}>
							{loading
								? 'Выполняется...'
								: mode === 'login'
									? 'Войти'
									: 'Зарегистрироваться'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

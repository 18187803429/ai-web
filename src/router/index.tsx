import { createHashRouter } from 'react-router-dom'
import App from '@/App'

const routers = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        lazy: async () => {
          const data = await import('@/pages/home')
          const Home = data.default
          return {
            element: <Home />
          }
        }
      }
    ]
  }
])

export default routers

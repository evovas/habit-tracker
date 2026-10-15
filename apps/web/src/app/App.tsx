import '@/shared/ui/styles/variables.css';
import './styles/index.css';

import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { routes } from './routes.ts';

const router = createBrowserRouter(routes);

const App = () => (
  <RouterProvider router={router} />
);

export default App;

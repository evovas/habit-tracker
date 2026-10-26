import '@/shared/ui/styles/variables.css';
import './styles/index.css';

import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { routes } from './routes.ts';
import { TanStackQueryProvider } from './TanStackQueryProvider.tsx';

const router = createBrowserRouter(routes);

const App = () => (
  <TanStackQueryProvider>
    <RouterProvider router={router} />
    <Toaster />
  </TanStackQueryProvider>
);

export default App;

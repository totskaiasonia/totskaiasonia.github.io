import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Admin } from './pages/Admin';
import { Home } from './pages/Home';
import { Privacy } from './pages/Privacy';
import { ProjectDetail } from './pages/ProjectDetail';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

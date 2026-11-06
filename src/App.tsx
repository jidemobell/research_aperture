import { Routes, Route } from 'react-router-dom';
import { IndexPage } from './pages/IndexPage';
import { ItemPage } from './pages/ItemPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/:slug" element={<ItemPage />} />
    </Routes>
  );
}

import { Route, Routes } from 'react-router';
import HomePage from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Header from '@/components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </>
  );
}

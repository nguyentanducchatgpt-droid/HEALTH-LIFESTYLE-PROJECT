import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Layout from './components/Layout';
import Home from './pages/Home';
import PillarA from './pages/PillarA';
import PillarAMovements from './pages/PillarAMovements';
import PillarAFramework from './pages/PillarAFramework';
import PillarAWeekly from './pages/PillarAWeekly';
import PillarAProgress from './pages/PillarAProgress';
import PillarB from './pages/PillarB';
import PillarC from './pages/PillarC';
import PillarD from './pages/PillarD';
import PillarE from './pages/PillarE';
import PillarF from './pages/PillarF';
import VideoLibrary from './pages/VideoLibrary';
import Program from './pages/Program';
import SamplePrograms from './pages/SamplePrograms';
import Pillars from './pages/Pillars';
import Contact from './pages/Contact';
import Donate from './pages/Donate';

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pillars" element={<Pillars />} />
          <Route path="/pillar/a" element={<PillarA />} />
          <Route path="/pillar/a/movements" element={<PillarAMovements />} />
          <Route path="/pillar/a/framework" element={<PillarAFramework />} />
          <Route path="/pillar/a/weekly" element={<PillarAWeekly />} />
          <Route path="/pillar/a/progress" element={<PillarAProgress />} />
          <Route path="/pillar/b" element={<PillarB />} />
          <Route path="/pillar/c" element={<PillarC />} />
          <Route path="/pillar/d" element={<PillarD />} />
          <Route path="/pillar/e" element={<PillarE />} />
          <Route path="/pillar/f" element={<PillarF />} />
          <Route path="/program" element={<Program />} />
          <Route path="/sample-programs" element={<SamplePrograms />} />
          <Route path="/videos" element={<VideoLibrary />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

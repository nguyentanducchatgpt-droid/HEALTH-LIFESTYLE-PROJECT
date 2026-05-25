import { useEffect, useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PillarA from './pages/PillarA';
import PillarAMovements from './pages/PillarAMovements';
import PillarAFramework from './pages/PillarAFramework';
import PillarAWeekly from './pages/PillarAWeekly';
import PillarAProgress from './pages/PillarAProgress';
import PillarB from './pages/PillarB';
import NutritionRoadmapPage from './pages/NutritionRoadmapPage';
import NutritionContentPage from './pages/NutritionContentPage';
import NutritionDataPage from './pages/NutritionDataPage';
import NutritionFormulaPage from './pages/NutritionFormulaPage';
import NutritionProteinPage from './pages/NutritionProteinPage';
import NutritionMealRulesPage from './pages/NutritionMealRulesPage';
import NutritionSevenDayPage from './pages/NutritionSevenDayPage';
import NutritionGoalPlanPage from './pages/NutritionGoalPlanPage';
import NutritionAdvancedPlanPage from './pages/NutritionAdvancedPlanPage';
import NutritionTwelveWeekPage from './pages/NutritionTwelveWeekPage';
import NutritionTwentyFourWeekPage from './pages/NutritionTwentyFourWeekPage';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  // useLayoutEffect fires before browser paint — no flash at old scroll position
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 100);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

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
          <Route path="/pillar/b/roadmap" element={<NutritionRoadmapPage />} />
          <Route path="/pillar/b/content" element={<NutritionContentPage />} />
          <Route path="/pillar/b/data" element={<NutritionDataPage />} />
          <Route path="/pillar/b/formula" element={<NutritionFormulaPage />} />
          <Route path="/pillar/b/protein" element={<NutritionProteinPage />} />
          <Route path="/pillar/b/meals" element={<NutritionMealRulesPage />} />
          <Route path="/pillar/b/7day" element={<NutritionSevenDayPage />} />
          <Route path="/pillar/b/goal-plan" element={<NutritionGoalPlanPage />} />
          <Route path="/pillar/b/advanced-plan" element={<NutritionAdvancedPlanPage />} />
          <Route path="/pillar/b/12week" element={<NutritionTwelveWeekPage />} />
          <Route path="/pillar/b/24week" element={<NutritionTwentyFourWeekPage />} />
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

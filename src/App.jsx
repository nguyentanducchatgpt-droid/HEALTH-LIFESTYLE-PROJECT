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
import NutritionChecklistPage from './pages/NutritionChecklistPage';
import NutritionTemplatePage from './pages/NutritionTemplatePage';
import NutritionMealPrepPage from './pages/NutritionMealPrepPage';
import NutritionSafetyPage from './pages/NutritionSafetyPage';
import PillarC from './pages/PillarC';
import LifestyleSleepPage from './pages/LifestyleSleepPage';
import LifestyleSleepRoutinePage from './pages/LifestyleSleepRoutinePage';
import LifestyleCircadianPage from './pages/LifestyleCircadianPage';
import LifestyleMorningPage from './pages/LifestyleMorningPage';
import LifestyleNeatPage from './pages/LifestyleNeatPage';
import LifestyleRecoveryPage from './pages/LifestyleRecoveryPage';
import LifestyleDeloadPage from './pages/LifestyleDeloadPage';
import LifestyleBreathingPage from './pages/LifestyleBreathingPage';
import LifestyleEnvironmentPage from './pages/LifestyleEnvironmentPage';
import LifestyleChecklistPage from './pages/LifestyleChecklistPage';
import LifestyleAssessmentPage from './pages/LifestyleAssessmentPage';
import LifestyleRoadmapPage from './pages/LifestyleRoadmapPage';
import PillarD from './pages/PillarD';
import MindStressPage from './pages/MindStressPage';
import MindBreathingPage from './pages/MindBreathingPage';
import MindMeditationPage from './pages/MindMeditationPage';
import MindBodyScanPage from './pages/MindBodyScanPage';
import MindJournalingPage from './pages/MindJournalingPage';
import MindBrainDumpPage from './pages/MindBrainDumpPage';
import MindDigitalDetoxPage from './pages/MindDigitalDetoxPage';
import MindGentleDisciplinePage from './pages/MindGentleDisciplinePage';
import MindHabitsPage from './pages/MindHabitsPage';
import MindChecklistPage from './pages/MindChecklistPage';
import MindAssessmentPage from './pages/MindAssessmentPage';
import MindRoadmapPage from './pages/MindRoadmapPage';
import PillarE from './pages/PillarE';
import HealthBMIPage from './pages/HealthBMIPage';
import HealthBPPage from './pages/HealthBPPage';
import HealthBloodSugarPage from './pages/HealthBloodSugarPage';
import HealthLipidsPage from './pages/HealthLipidsPage';
import HealthRedFlagsPage from './pages/HealthRedFlagsPage';
import HealthMedSafetyPage from './pages/HealthMedSafetyPage';
import HealthMediaLiteracyPage from './pages/HealthMediaLiteracyPage';
import HealthPreventionPage from './pages/HealthPreventionPage';
import HealthSelfMonitoringPage from './pages/HealthSelfMonitoringPage';
import HealthCheckupPage from './pages/HealthCheckupPage';
import HealthAssessmentPage from './pages/HealthAssessmentPage';
import HealthRoadmapPage from './pages/HealthRoadmapPage';
import PillarF from './pages/PillarF';
import ToolsChecklistPage from './pages/ToolsChecklistPage';
import ToolsWorkoutLogPage from './pages/ToolsWorkoutLogPage';
import ToolsMealPlanPage from './pages/ToolsMealPlanPage';
import ToolsLifestyleTrackerPage from './pages/ToolsLifestyleTrackerPage';
import ToolsMindTrackerPage from './pages/ToolsMindTrackerPage';
import ToolsHealthScorePage from './pages/ToolsHealthScorePage';
import ToolsQuickWorkoutsPage from './pages/ToolsQuickWorkoutsPage';
import ToolsMealPrepPage from './pages/ToolsMealPrepPage';
import ToolsResetProtocolPage from './pages/ToolsResetProtocolPage';
import ToolsProgressTestPage from './pages/ToolsProgressTestPage';
import ToolsRoadmapPage from './pages/ToolsRoadmapPage';
import VideoLibrary from './pages/VideoLibrary';
import FAQ from './pages/FAQ';
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
          <Route path="/pillar/b/checklist" element={<NutritionChecklistPage />} />
          <Route path="/pillar/b/template" element={<NutritionTemplatePage />} />
          <Route path="/pillar/b/mealprep" element={<NutritionMealPrepPage />} />
          <Route path="/pillar/b/safety" element={<NutritionSafetyPage />} />
          <Route path="/pillar/c" element={<PillarC />} />
          <Route path="/pillar/c/sleep" element={<LifestyleSleepPage />} />
          <Route path="/pillar/c/sleep-routine" element={<LifestyleSleepRoutinePage />} />
          <Route path="/pillar/c/circadian" element={<LifestyleCircadianPage />} />
          <Route path="/pillar/c/morning" element={<LifestyleMorningPage />} />
          <Route path="/pillar/c/neat" element={<LifestyleNeatPage />} />
          <Route path="/pillar/c/recovery" element={<LifestyleRecoveryPage />} />
          <Route path="/pillar/c/deload" element={<LifestyleDeloadPage />} />
          <Route path="/pillar/c/breathing" element={<LifestyleBreathingPage />} />
          <Route path="/pillar/c/environment" element={<LifestyleEnvironmentPage />} />
          <Route path="/pillar/c/checklist" element={<LifestyleChecklistPage />} />
          <Route path="/pillar/c/assessment" element={<LifestyleAssessmentPage />} />
          <Route path="/pillar/c/roadmap" element={<LifestyleRoadmapPage />} />
          <Route path="/pillar/d" element={<PillarD />} />
          <Route path="/pillar/d/stress" element={<MindStressPage />} />
          <Route path="/pillar/d/breathing" element={<MindBreathingPage />} />
          <Route path="/pillar/d/meditation" element={<MindMeditationPage />} />
          <Route path="/pillar/d/body-scan" element={<MindBodyScanPage />} />
          <Route path="/pillar/d/journaling" element={<MindJournalingPage />} />
          <Route path="/pillar/d/brain-dump" element={<MindBrainDumpPage />} />
          <Route path="/pillar/d/digital-detox" element={<MindDigitalDetoxPage />} />
          <Route path="/pillar/d/gentle-discipline" element={<MindGentleDisciplinePage />} />
          <Route path="/pillar/d/habits" element={<MindHabitsPage />} />
          <Route path="/pillar/d/checklist" element={<MindChecklistPage />} />
          <Route path="/pillar/d/assessment" element={<MindAssessmentPage />} />
          <Route path="/pillar/d/roadmap" element={<MindRoadmapPage />} />
          <Route path="/pillar/e" element={<PillarE />} />
          <Route path="/pillar/e/bmi" element={<HealthBMIPage />} />
          <Route path="/pillar/e/blood-pressure" element={<HealthBPPage />} />
          <Route path="/pillar/e/blood-sugar" element={<HealthBloodSugarPage />} />
          <Route path="/pillar/e/lipids" element={<HealthLipidsPage />} />
          <Route path="/pillar/e/red-flags" element={<HealthRedFlagsPage />} />
          <Route path="/pillar/e/medication" element={<HealthMedSafetyPage />} />
          <Route path="/pillar/e/media-literacy" element={<HealthMediaLiteracyPage />} />
          <Route path="/pillar/e/prevention" element={<HealthPreventionPage />} />
          <Route path="/pillar/e/self-monitoring" element={<HealthSelfMonitoringPage />} />
          <Route path="/pillar/e/checkup" element={<HealthCheckupPage />} />
          <Route path="/pillar/e/assessment" element={<HealthAssessmentPage />} />
          <Route path="/pillar/e/roadmap" element={<HealthRoadmapPage />} />
          <Route path="/pillar/f" element={<PillarF />} />
          <Route path="/pillar/f/checklist" element={<ToolsChecklistPage />} />
          <Route path="/pillar/f/workout-log" element={<ToolsWorkoutLogPage />} />
          <Route path="/pillar/f/meal-plan" element={<ToolsMealPlanPage />} />
          <Route path="/pillar/f/lifestyle-tracker" element={<ToolsLifestyleTrackerPage />} />
          <Route path="/pillar/f/mind-tracker" element={<ToolsMindTrackerPage />} />
          <Route path="/pillar/f/health-score" element={<ToolsHealthScorePage />} />
          <Route path="/pillar/f/quick-workouts" element={<ToolsQuickWorkoutsPage />} />
          <Route path="/pillar/f/meal-prep" element={<ToolsMealPrepPage />} />
          <Route path="/pillar/f/reset-protocol" element={<ToolsResetProtocolPage />} />
          <Route path="/pillar/f/progress-test" element={<ToolsProgressTestPage />} />
          <Route path="/pillar/f/roadmap" element={<ToolsRoadmapPage />} />
          <Route path="/program" element={<Program />} />
          <Route path="/sample-programs" element={<SamplePrograms />} />
          <Route path="/videos" element={<VideoLibrary />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

import { SceneRoot } from './scene/SceneRoot';
import { BodyRail } from './ui/BodyRail';
import { InfoPanel } from './ui/InfoPanel';
import { TimeControls } from './ui/TimeControls';

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white antialiased">
      <SceneRoot />
      <BodyRail />
      <InfoPanel />
      <TimeControls />
    </div>
  );
}

export default App;

import { useState } from 'react';
import { SceneRoot } from './scene/SceneRoot';
import { BodyRail } from './ui/BodyRail';
import { InfoPanel } from './ui/InfoPanel';
import { TimeControls } from './ui/TimeControls';
import { Landing } from './ui/Landing';

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white antialiased">
      <SceneRoot />

      {entered ? (
        <>
          <BodyRail />
          <InfoPanel />
          <TimeControls />
        </>
      ) : (
        <Landing onEnter={() => setEntered(true)} />
      )}
    </div>
  );
}

export default App;

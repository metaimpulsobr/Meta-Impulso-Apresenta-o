import { PresentationPlayer } from './components/PresentationPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Glow Effects in the background corners */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D649FB]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#6BCFFE]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <PresentationPlayer />
    </div>
  );
}

import BrainScene from '@/components/Brain';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-[auto,1fr]">
      <Sidebar />
      <BrainScene />
    </div>
  );
}

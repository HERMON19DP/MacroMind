import Topbar from "../components/Topbar";
import ChatPanel from "../components/ChatPanel";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

const recentMeals = [
  { name: "Idli & Sambar", time: "Today, 8:30 AM", cal: 310 },
  { name: "Sambar rice", time: "Today, 1:00 PM", cal: 380 },
  { name: "Curd rice", time: "Yesterday, 7:00 PM", cal: 290 },
  { name: "Poha", time: "Yesterday, 8:15 AM", cal: 250 },
];

export default function Chat() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar
        title="AI Nutrition"
        subtitle="Describe meals or upload a photo"
      />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Chat — takes 2 cols */}
          <div className="col-span-2 h-[calc(100vh-140px)]">
            <ChatPanel />
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">


          </div>
        </div>
      </div>
    </div>
  );
}

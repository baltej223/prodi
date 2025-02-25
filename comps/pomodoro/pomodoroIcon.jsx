import { Timer, Clock, Circle } from "lucide-react";

export default function PomodoroIcon({className}) {
  return (
    <div className={`relative w-3 h-3 ${className}`} >
      <Circle className="absolute text-black w-10 h-10" />
      <Clock className="absolute text-black w-6 h-6 top-2 left-2" />
    </div>
  );
}
import React, { useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import SideBar from "./sidebar";
import { Button } from "@/components/ui/button";

export default function Pomodoro() {
  const [key, setKey] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [open, setOpen] = useState(false);

  const handleComplete = () => {
    setIsBreak((prev) => !prev);
    setKey((prev) => prev + 1); // Reset timer
  };

  const pomoComp = 
  <>
  <h2 className="text-xl font-semibold mb-3">
          {isBreak ? "Break Time" : "Work Time"}
        </h2>
        <div onContextMenu={(e) => { e.preventDefault(); setOpen(true); }}>
          <FlipClockCountdown
            key={key}
            className="h-[150px] w-auto"
            to={new Date().getTime() + (isBreak ? breakDuration : workDuration) * 60 * 1000}
            digitBlockStyle={{ background: "#333", color: "#fff" }}
            labelStyle={{ display: "none" }}
            onComplete={handleComplete}
          />  
        </div>
  </>;

  let [content, setContent] = React.useState(<></>);
  React.useEffect(() => {
    setContent(
      <>
        <Button variant="outline" className="w-32 h-24 text-2xl rounded-xl"
        onClick={()=>{
          setContent(pomoComp);
        }}
        >Start</Button>
      </>
    );
  },[setContent]);
  return (
    <div className="flex flex-column w-auto z-1000 w-full h-screen ">
      <SideBar />

      <div className="flex flex-col items-center justify-center h-[80%] md:w-[65%] lg:w-[65%] w-full">
        {/* <h2 className="text-xl font-semibold mb-3">
          {isBreak ? "Break Time" : "Work Time"}
        </h2>
        <div onContextMenu={(e) => { e.preventDefault(); setOpen(true); }}>
          <FlipClockCountdown
            key={key}
            to={new Date().getTime() + (isBreak ? breakDuration : workDuration) * 60 * 1000}
            digitBlockStyle={{ background: "#333", color: "#fff" }}
            labelStyle={{ display: "none" }}
            onComplete={handleComplete}
          />  
        </div> */}
        {content}
      </div>

      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent >
          <h3 className="text-lg font-semibold">Adjust Pomodoro</h3>
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex items-center gap-10">
              Work Duration (min): 
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="w-16 p-1 text-center rounded text-black border border-gray-700 rounded"
              />
            </label>
            <label className="flex items-center gap-10">
              Break Duration (min):
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-16 p-1 text-center rounded text-black border border-gray-700 rounded"
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};


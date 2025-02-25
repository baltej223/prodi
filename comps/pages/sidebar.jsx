import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { SideBar_ } from "@/comps/pages/pagesSidebar";
import React from "react";

export default function SideBar({ children, className , states}) {
  console.log(states);
  let _states = states && (typeof states=="object") ? states[0]: new Error("No states sent to sidebar");
  let setStateFunctions = states && (typeof states=="object") ? states[1]: new Error("No state updation functions provided to sidebar");

  return (
    <div>
      <SidebarProvider>
        <>
        <div className={`${className}`}>  
          <SideBar_ className="ml-20" states={_states} stateUpdationFunction={setStateFunctions} />
          <SidebarInset className="flex-1">
            <header className="flex h-10 items-center mx-5 fixed top-1 left-[2px] z-10 lg:hidden xl:hidden md:hidden border-black">
              <SidebarTrigger className='' />
            </header>
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </SidebarInset>
          
        </div>
        </>
      </SidebarProvider>
    </div>
  );
}

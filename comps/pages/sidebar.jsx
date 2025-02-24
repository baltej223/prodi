import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { SideBar_ } from "@/comps/pages/pagesSidebar";
import React from "react";

export default function SideBar({ children, className}) {
  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <>
        <div className={`flex h-screen ${className}`}>  
          <SideBar_ className="ml-20"/>
          {/* 
          - here categories is an alias for list and basically both of them are the same thing.
          - renderForList : its an alias for list param which was passed to <Sidebar/> (!= <SideBar_/>)
          - Set list state is the same which was passed by used from <Sidebar/>
          - For checking content: check @/app/comps/todo.jsx
          */}
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

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { SideBar_ } from "@/comps/todoSidebar"
import React from "react" // Added import for React

export default function SideBar({ children , className}) {
  return (
    <div >
    <SidebarProvider>
      <div className={`flex h-screen ${className}`}>
        <SideBar_ />
        <SidebarInset className="flex-1">
          <header className="flex h-10 items-center mx-5 fixed top-1 left-[2px] z-10 lg:hidden xl:hidden md:hidden border-black">
          <SidebarTrigger className=''/>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    </div>
  )
}


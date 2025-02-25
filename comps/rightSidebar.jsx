'use client'

import * as React from 'react'
import { CheckSquare, Calendar, Target, Clock, BarChart, Settings,NotebookText  } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import useRouteTo from '@/hooks/useRouter'

const sidebarItems = [
    { title: 'Todo', icon: CheckSquare, uri: "todo" },
    { title: 'Pomodoro', icon: Clock, uri: "pomodoro" },
    { title: 'Pages', icon: NotebookText , uri: "pages" },
    { title: 'Goals', icon: Target, uri: "goals" },
    { title: 'Scheduler', icon: Calendar, uri: "scheduler" },
    { title: 'Deadlines', icon: Clock, uri: "deadlines" },
    { title: 'Analytics', icon: BarChart, uri: "analytics" },
    { title: 'Settings', icon: Settings, uri: "settings" },
]

export default function RightSidebar({setState}) {
    const [currentUri, setCurrentUri] = React.useState("");

     useRouteTo(currentUri, setState);

     const handleRoute = (uri) => {
        setCurrentUri(uri);
    };
  return (
    <SidebarProvider className="h-0">
      <Sidebar side="right" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <span className="font-bold text-xl">....</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <span className="flex items-center cursor-pointer" onClick={()=>{
                        handleRoute(item.uri);
                    }}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarTrigger className="fixed bottom-4 right-4" />
    </SidebarProvider>
  )
}
"use client"

import * as React from "react"
import { Plus, ListTodo, Calendar, Star, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import signout from "@/hooks/signout"

const DUMMY_categories = [
  { name: "All Tasks", uri:"all_tasks", icon: ListTodo },
  { name: "Today",uri:"today", icon: Calendar },
  { name: "Important",uri:"name", icon: Star },
]

export function SideBar_({categories = DUMMY_categories, renderForlist, setListState}) {
  const [NewsList, setNewsList] = React.useState("")

  const handleAddList = (e) => {
    e.preventDefault()
    // Add logic to add the task
    console.log("Adding task:", NewsList)
    setNewsList("")
  }
  const handleClick =(listName)=>{
    console.log("rhe");
    listName = listName.toString().toLowerCase();
    setListState(listName);
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-2 py-4">
        <h2 className="px-4 text-lg font-semibold tracking-tight">{ renderForlist?`${String(renderForlist).charAt(0).toUpperCase() + String(renderForlist).slice(1)}` : "My Todo" }</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton className="w-full justify-start">
                    <category.icon className="mr-2 h-4 w-4" />
                    <Button 
                    onClick={()=>{handleClick(category.uri)}}
                    variant="ghost" 
                    >
                      {category.name}
                      </Button> 
                    {/* {category.name} */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
          <form onSubmit={handleAddList} className="mt-4">
              <SidebarInput
                type="text"
                placeholder="Create a new List..."
                value={NewsList}
                onChange={(e) => setNewsList(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="sm" className="mt-2 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
          </form>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
              <LogOut className="mr-2 h-4 w-4" onClick={signout}/>
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


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

const categories = [
  { name: "All Tasks", icon: ListTodo },
  { name: "Today", icon: Calendar },
  { name: "Important", icon: Star },
]

export function SideBar_() {
  const [newTask, setNewTask] = React.useState("")

  const handleAddTask = (e) => {
    e.preventDefault()
    // Add logic to add the task
    console.log("Adding task:", newTask)
    setNewTask("")
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-2 py-4">
        <h2 className="px-4 text-lg font-semibold tracking-tight">My Tasks</h2>
        <form onSubmit={handleAddTask} className="mt-4">
          <SidebarInput
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm" className="mt-2 w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </form>
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
                    {category.name}
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
            <SidebarMenuButton className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


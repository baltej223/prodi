"use client"

import * as React from "react"
import { Plus, Settings, LogOut, FileText  } from "lucide-react"
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

const DUMMY_categories = [
  { name: "All Tasks",    uri:"all_tasks",    icon: FileText },
  { name: "Today",        uri:"today",        icon: FileText },
  { name: "Important",    uri:"important",    icon: FileText },
]
let categories = DUMMY_categories;
// function replaceAllSpaces(parentstring, auxillarystring){return parentstring.split(" ").join()}
export function SideBar_() {
  return (
  <div className="flex flex-col">
    <Sidebar className="border-r" side="left" collapsible="icon">
      <SidebarHeader className="px-2 py-4">
          <h2 className="px-4 text-lg font-semibold tracking-tight">Pages</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton className="w-full justify-start">
                    <category.icon className="mr-2 h-4 w-4" />
                    <Button 
                    // onClick={()=>{handleClick(category.uri)}}
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
          <form className="mt-4">
              {/* <SidebarInput
                type="text"
                placeholder="Create a new page.."
                // value={NewsList}
                // onChange={(e) => setNewsList(e.target.value)}
                className="w-full"
              /> */}
              <Button type="submit" size="sm" className="mt-2 w-full" 
              onClick={
              (e)=>{
                e.preventDefault();
                }
              }>
                <Plus className="mr-2 h-4 w-4" />
                Add New Page
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
              <LogOut className="mr-2 h-4 w-4"/>
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}


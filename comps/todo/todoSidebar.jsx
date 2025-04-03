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
import { createList, getLists } from "@/hooks/apiHandlers"
import Loader from "../loader"


const DUMMY_categories = [
  // { name: "All Tasks",    uri:"all_tasks",    icon: ListTodo },
  // { name: "Today",        uri:"today",        icon: Calendar },
  // { name: "Important",    uri:"important",    icon: Star },
]

// function replaceAllSpaces(parentstring, auxillarystring){return parentstring.split(" ").join()}
export function SideBar_({categories="", renderForlist, setListState, content}) {

  let setCategories;
  [categories, setCategories] = React.useState(DUMMY_categories);

    function setlists() {
      getLists().then((response) => {
      console.log(response);
      if (response && response.lists) {
        // let item = {};
        // response.lists.forEach((list, index)=>{
        //     let itemUri = list;
        //     item.uri=itemUri;
        //     let itemName = itemUri.split("_").join(" "); // First replace underscores
        //     itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1); // Then capitalize
        //     item.name=itemName;
        //     if (index==0){
        //       item.icon = Star;
        //     }
        //     if (index==1){
        //       item.icon=Calendar;
        //     }

      const newCategories = [];
      response.lists.forEach((list, index) => {
        let itemUri = list;
        let itemName = list.split("_").join(" "); // First replace underscores
        itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1); // Then capitalize
        const item = {
          uri: itemUri,
          name: itemName,
          icon: index === 0 ? Star : index === 1 ? Calendar : ListTodo,
        };
        newCategories.push(item);
      });

      console.log("New categories:", newCategories);

      setCategories((cat) => {
        let updatedCategories = [...cat];
        newCategories.forEach((item) => {
          if (!updatedCategories.some((cat) => cat.uri === item.uri)) {
            updatedCategories = updatedCategories.concat(item);
          }
        });
        console.log("Updated categories:", updatedCategories);
        return updatedCategories;
      });

        sessionStorage.setItem("list", JSON.stringify(item));


      } 
      }).catch((error) => {
      console.log("Error fetching lists:", error);
      });
    }

    React.useEffect(() => {
      setlists();
    }, []);

  const [NewsList, setNewsList] = React.useState("")

   const handleAddList = async (e) => {
    e.preventDefault()
    // Add logic to add the task
    console.log("Adding task:", NewsList);
    try{
      await createList(NewsList.toLowerCase().split(" ").join("_"));
      setCategories((_cat)=> [..._cat,
        {
          name:NewsList,
          uri:NewsList.toLowerCase().split(" ").join("_"),
          icon:ListTodo
        }
      ]
      );
    }
    catch(e)
  {  console.log("Some error occured ",e);}
    setNewsList("")
  }
  const handleClick = (listName) =>{
    // console.log("rhe");
    listName = listName.toString().toLowerCase();
    setListState(listName);
  }

  return (
  <div className="flex flex-col">
    <Sidebar className="border-r" side="left" collapsible="icon">
      <SidebarHeader className="px-2 py-4">
          <h2 className="px-4 text-lg font-semibold tracking-tight">{ renderForlist?`${(String(renderForlist).charAt(0).toUpperCase() + String(renderForlist).slice(1).split("_").join(" "))}` : "My Todo" }</h2>
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
              <LogOut className="mr-2 h-4 w-4"/>
              <Button variant="link" onClick={signout}>
                Logout
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}


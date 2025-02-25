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
import PagesApiHandler from "./pages.apihandler"

export function SideBar_({states, stateUpdationFunction}) {

  let [pages, setPages] = React.useState([]);
  const [newPageTitle, setNewPageTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  // api handler here

  const cookie = JSON.parse(document.cookie).loginCookie;

  React.useEffect(() => {
    async function fetchTitles() {
      try {
        const response = await PagesApiHandler.getTitles(cookie);
        if (PagesApiHandler.isValidResponse(response)) {
          // Clear previous pages and properly map the titles to the expected format
          let pageArr = response.titles.map(title => ({
            pageTitle: title
          }));
          setPages(pageArr);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchTitles();
  }, []);

  const handleGetPage = async (page) => {
    try {
      const response = await PagesApiHandler.getPage(page.pageTitle, cookie);
      if (PagesApiHandler.isValidResponse(response) && response.page) {
        // Update parent component's state using the provided state updation function
        if (stateUpdationFunction) {
          stateUpdationFunction(prev => {
            const newState = [...prev];
            const pageTitleState = newState.find(s => Object.keys(s)[0] === "pageTitle");
            const pageContentState = newState.find(s => Object.keys(s)[0] === "pageContent");
            const idState = newState.find(s => Object.keys(s)[0] === "_id");
            
            if (pageTitleState) pageTitleState.func(response.page.title);
            if (pageContentState) pageContentState.func(response.page.body);
            if (idState && response.page._id) idState.func(response.page._id);
            
            return newState;
          });
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCreatePage = async (title) => {
    try {
      const response = await PagesApiHandler.createPage(title, "", cookie.toString());
      console.log("using Cookie:", cookie);
      if (PagesApiHandler.isValidResponse(response)) {
        // Add the new page to the pages state
        setPages(prevPages => [...prevPages, { pageTitle: title }]);
        // Clear any previous errors
        console.log(null);
      }
    } catch (err) {
      console.log(err.message);
      console.log("using Cookie:", cookie);
    }
  };

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
                {error && (
                  <SidebarMenuItem>
                    <span className="text-red-500 px-4 text-sm">{error}</span>
                  </SidebarMenuItem>
                )}
                
                {pages.map((page, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      className={`w-full justify-start`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <Button 
                        variant="ghost" 
                        onClick={() => handleGetPage(page)}
                      >
                        {page.pageTitle}
                      </Button>
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
              <form className="mt-4" onSubmit={(e) => {
                e.preventDefault();
                if (newPageTitle.trim()) {
                  handleCreatePage(newPageTitle);
                  setNewPageTitle(""); // Clear input after creation
                }
              }}>
                <SidebarInput
                  type="text"
                  placeholder="Create a new page.."
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="mt-2 w-full"
                  disabled={!newPageTitle.trim()}
                >
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
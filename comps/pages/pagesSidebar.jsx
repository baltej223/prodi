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

const DUMMY_categories = [
  { name: "All Tasks",    uri:"all_tasks",    icon: FileText },
  { name: "Today",        uri:"today",        icon: FileText },
  { name: "Important",    uri:"important",    icon: FileText },
]
let categories = DUMMY_categories;
// function replaceAllSpaces(parentstring, auxillarystring){return parentstring.split(" ").join()}
export function SideBar_({states, stateUpdationFunction}) {



  // api handler here
  const cookie = JSON.parse(document.cookie).loginCookie;

  // Find pages state from states array
  console.log(states);
  const pagesState = states.find(s => s.state && Array.isArray(s.state));
  const pages = pagesState ? pagesState.state : [];

  // Update the main state with new pages
  const setPages = (newPages) => {
    stateUpdationFunction(prevStates => {
      const newStates = prevStates.filter(s => 
        !Array.isArray(s.state) // Remove old pages state
      );
      return [
        ...newStates,
        { state: newPages, func: setPages }
      ];
    });
  };

  // Keep error handling local as it's UI specific
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchPages() {
      try {
        const response = await PagesApiHandler.getTitles(cookie);
        if (PagesApiHandler.isValidResponse(response)) {
          setPages(response.titles);
        }
      } catch (error) {
        setError(error.message);
      }
    }
    fetchPages();
  }, []);

  // Rest of your handlers remain the same but use the new setPages
  const handleCreatePage = async (title) => {
    try {
      const response = await PagesApiHandler.createPage(title, cookie);
      if (PagesApiHandler.isValidResponse(response)) {
        setPages([...pages, title]);
      }
    } catch (error) {
      setError(error.message);
    }
  };


  const handleDeletePage = async (page) => {
    try {
      const response = await PagesApiHandler.deletePage(page._id, cookie);
      if (PagesApiHandler.isValidResponse(response)) {
        setPages(pages.filter(p => p._id !== page._id));
      }
    } catch (error) {
      setError(error.message);
    }
  };
  

  const [newPageTitle, setNewPageTitle] = React.useState("");
  
  const handleGetPage = async (page) => {
    if (!loadPage) {
      setError("Page loading function not available");
      return;
    }

    try {
      await loadPage(page);
    } catch (error) {
      setError(error.message);
    }
  };
  
   // Find the loadPage function from states
   const loadPageState = states.find(s => typeof s.state === 'function');
   const loadPage = loadPageState ? loadPageState.state : null;
   

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
                
                {pages.map((page) => (
                  <SidebarMenuItem key={page}>
                    <SidebarMenuButton 
                      className={`w-full justify-start ${
                        states.find(s => s.state === page)?.state === page 
                          ? 'bg-gray-100' 
                          : ''
                      }`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <Button 
                        variant="ghost" 
                        onClick={() => handleGetPage(page)}
                      >
                        {page}
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
                  // disabled={!newPageTitle.trim()}
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


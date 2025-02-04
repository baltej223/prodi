"use client";
import { useState, useEffect } from "react";
import RouteTo from "@/hooks/router";
import SideBar from "../comps/sidebar";
import {redirectTo} from "@/hooks/redirectTo";

export default function Home() {
  useEffect(() => {
    redirectTo();
  }, []);

  let [content, setContent] = useState("");
  
  RouteTo("todo", setContent);


  return (
  <>
  <div className="flex flex-column gap-x-5">
  <SideBar className=""/>
  
  <div className="content w-[90%] ">  
  {content}
  </div>

  </div>
  </>
  );
}

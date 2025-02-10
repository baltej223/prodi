"use client";
import { useState, useEffect } from "react";
import RouteTo from "@/hooks/router";
import {redirectTo} from "@/hooks/redirectTo";
import Loader from "@/comps/loader"

export default function Home() {
  useEffect(() => {
     redirectTo();
  }, []);
  let [content, setContent] = useState("");
  useEffect(()=>{
    setContent(<Loader/>);
  },[]);
  RouteTo("todo", setContent);
  
  return (content);
  
}

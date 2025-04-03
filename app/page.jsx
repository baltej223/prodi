"use client";
import { useState, useEffect } from "react";
import useRouteTo from "@/hooks/useRouter";
import {redirectTo} from "@/hooks/redirectTo";
import Loader from "@/comps/loader";

export default function Home() {
  useEffect(() => {
     redirectTo();
  }, []);
  
  let [content, setContent] = useState("");
  useEffect(()=>{
    setContent(<Loader/>);
  },[]);
  useRouteTo("todo", setContent);
  
  return (
    <>
    {content}
    </>
  );
  
}

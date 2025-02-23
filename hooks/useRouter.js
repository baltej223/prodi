import { useState, useEffect, useMemo } from "react";
import { TodoContent } from "@/comps/todo/todo";
import Pomodoro from "@/comps/pomodoro/pomodoro";
// import { Sidebar } from "@/app/comps/sidebar";


export default function useRouteTo(uri, setState) {
  let [index, setIndex] = useState(-1);

  const uris = useMemo(
    () => [
      {
        uri: "todo",
        tangledIndex: 0,
        tangledComponent: <TodoContent content={setState}/>, 
        // passing param content is neccesary as it will provide power to <todoContent/> and sidebar to use RouteTo hook
      },
      {
        uri: "pomodoro",
        tangledIndex: 1,
        tangledComponent: <Pomodoro/>,
      },
      {
        uri: "todo2",
        tangledIndex: 2,
        tangledComponent: "",
      },
      {
        uri: "todo3",
        tangledIndex: 3,
        tangledComponent: "",
      },
    ],
    []
  );

  useEffect(() => {
    uris.forEach((_uri, idx) => {
      if (_uri.uri === uri) {
        setIndex(idx);
      }
    });
  }, [uri, uris]);

  useEffect(() => {
    if (index !== -1) {
      let tangledComponent = uris[index].tangledComponent;
      setState(tangledComponent);
    }
  }, [index, uris, setState]);
}
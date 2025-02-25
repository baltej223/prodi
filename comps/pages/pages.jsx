"use client";
import { useEffect, useState } from "react";
import SideBar from "./sidebar";
import PagesApiHandler from "./pages.apihandler";

export default function Pages() {
    const [states, setStates] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const [pageContent, setPageContent] = useState("");
    const [error, setError] = useState(null);

    // Define the loadPage function
    const loadPage = async (title) => {
        try {
            const cookie = JSON.parse(document.cookie).loginCookie;
            const response = await PagesApiHandler.getPage(title, cookie);
            
            if (response && response.page) {
                setPageTitle(response.page.title);
                setPageContent(response.page.body);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        setStates(prevStates => {
            const newStates = prevStates.filter(s => 
                s.state !== pageTitle && 
                s.state !== pageContent && 
                typeof s.state !== 'function' // Remove old loadPage function
            );
            return [
                ...newStates,
                { state: pageTitle, func: setPageTitle },
                { state: pageContent, func: setPageContent },
                { state: loadPage, func: null } // Add loadPage function to states
            ];
        });
    }, [pageTitle, pageContent]);

    return (
        <>
            <div className="flex flex-row gap-x-[5%] pt-[1%]">
                <SideBar states={[states, setStates]}/>
                <div className="page flex-1 p-4">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
                    <div className="whitespace-pre-wrap">{pageContent}</div>
                </div>
            </div>
        </>
    );
}
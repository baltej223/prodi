import { redirectTo } from "./redirectTo";

export default function CommandHandler(command){
    if (command=="re-load"){
        document.cookie="";
        redirectTo();
    }
}
import * as React from "react";
import TopAppbar from "../parts/TopAppbar";

const Main = () => (
    <div className="mainContainer">
        <TopAppbar/>
        
        <div>Github repo:</div>
        <a href="https://www.github.com/enuchi/React-Google-Apps-Script"
            target="_blank"
            rel="noopener noreferrer">
            React + Google Apps Script
        </a>
        <div>-Ken Sakurai</div>
    </div>
);
export default Main;

import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
function Homepage() {
    return <App />
}

ReactDOM.render(<BrowserRouter><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link><Homepage /></BrowserRouter>, document.getElementById("root"));
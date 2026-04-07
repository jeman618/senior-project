import React from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header.jsx";

function About() {
    return (
        <>
        <Header />
        <div className="middle">
            <p>GardenGuru is a web application that helps users to grow their favorite plants.</p>
            <p>Our mission is to provide users with easy-to-understand guides to give them the knowledge 
                and resources they need to succeed in their gardening endeavors.</p>
            <p>Our team of experts is passionate about gardening and technology, and we are committed to making a user-friendly platform
                that connects users to nature and helps them grow their own plants, whether they are seasoned gardeners or just starting out.</p> 
            <p>Thank you for choosing GardenGuru. We hope you find our resources helpful in your gardening journey!</p>
        </div>
        </>
    );
}

const container = document.getElementById("about");
const root = ReactDOMClient.createRoot(container);
root.render(<About />);
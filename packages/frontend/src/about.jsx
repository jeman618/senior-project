// packages/frontend/src/about.jsx

import React from "react";
import ReactDOMClient from "react-dom/client";
import Header from "./header.jsx";

function About() {
    return (
        <>
        <Header />
        <div className="middle">
            <img className="about-img" src="/images/farmers.png" alt="Farmers picking crops"/>
            <p>GardenGuru is a web application that helps users grow their favorite plants. 
                For anyone who wishes to grow their own food, this is the tool for you!</p>
            <p>Our mission is to provide users with easy-to-understand guides that give them the knowledge 
                and resources they need to succeed in their gardening endeavors.
                Find the plant you have always wanted to grow, or even add it to our community-driven collection!</p>
            <p>Our team of experts is passionate about gardening and technology, and we are committed to making a user-friendly platform
                that connects users to nature and helps them grow their own plants, whether they are seasoned gardeners or just starting out.</p>
            <p>Thank you for choosing GardenGuru. We hope you find our resources helpful in your gardening journey!</p>
            <img className="logo-img" src="/garden-guru/images/logo.png" alt="GardenGuru's Logo"/>
        </div>
        </>
    );
}

const container = document.getElementById("about");
const root = ReactDOMClient.createRoot(container);
root.render(<About />);
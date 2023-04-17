import React, { useState } from "react";
import "./Tabs.css";

function Tabs(props) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = tabIndex => {
        setActiveTab(tabIndex);
    };

    return (
        <div className="tabs-container">
            <ul className="tabs-nav">
                {props.tabs.map((tab, index) => (
                    <li key={index} className={activeTab === index ? "active" : ""}>
                        <button onClick={() => handleTabClick(index)}>{tab.title}</button>
                    </li>
                ))}
            </ul>
            <div className="tabs-content">
                {props.tabs
                    .filter((_, index) => index === activeTab)
                    .map((tab, index) => (
                        <div key={index} className={"tab active"}>
                            {tab.content}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Tabs;

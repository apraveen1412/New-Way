import './Sidebar.css';
import { useState } from "react";

export default function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`sidebar bg-dark text-white ${
                    open ? "sidebar-open" : "sidebar-closed"
                }`}
            >
                <div className="d-flex flex-column h-100">

                    {/* Sidebar Header */}
                    <div className="d-flex align-items-center justify-content-between p-3">
                        {open && (
                            <h5 className="mb-0">New Way</h5>
                        )}

                        <button className="btn btn-dark" onClick={() => setOpen(!open)}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    {open && (
                        <div className="px-3">
                            <button className="btn btn-outline-light w-100 mb-2">
                                <i className="fa-solid fa-plus me-2"></i>New Chat</button>
                            <button className="btn btn-dark w-100 text-start mb-2">
                                <i className="fa-solid fa-cloud me-2"></i>Cloud AI</button>
                            <button className="btn btn-dark w-100 text-start">
                                <i className="fa-solid fa-microchip me-2"></i>Local AI</button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={`main-content ${
                    open ? "content-sidebar-open" : "content-sidebar-closed"
                }`}>
                {/* Your chat UI goes here */}
            </main>
        </>
    );
}

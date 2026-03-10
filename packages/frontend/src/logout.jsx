// packages/frontend/src/logout.jsx

function Logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html"
}

export default Logout
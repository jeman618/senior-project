// packages/frontend/src/logout.jsx

function Logout() {
    localStorage.removeItem("token");
    window.location.href = "/garden-guru/index.html"
}

export default Logout
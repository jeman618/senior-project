function Logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html"
}

export default Logout
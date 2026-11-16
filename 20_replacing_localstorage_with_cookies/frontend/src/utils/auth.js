const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

function getCsrfToken() {
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export async function authFetch(url, options = {}) {

    const method = (options.method || "GET").toUpperCase();

    const headers = {
        ...options.headers
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
    }

    return fetch(url, {
        ...options,
        credentials: "include",
        headers
    });
}

export async function checkLogin() {
    try {
        const response = await authFetch(`${BASE}/api/me/`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

export async function logoutUser() {
    return authFetch(`${BASE}/api/logout/`, {
        method: "POST"
    });
}

import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'token';
const TOKEN_COOKIE_OPTIONS = {
    path: '/',
    sameSite: 'lax',
};

export const getToken = () => Cookies.get(TOKEN_COOKIE_NAME);

export const setToken = (token) => {
    clearToken();
    Cookies.set(TOKEN_COOKIE_NAME, token, TOKEN_COOKIE_OPTIONS);
};

export const clearToken = () => {
    const paths = ['/', '/signin', '/signup', '/write-diary', '/calendar'];

    paths.forEach((path) => {
        Cookies.remove(TOKEN_COOKIE_NAME, { path });
    });

    if (typeof window !== 'undefined') {
        Cookies.remove(TOKEN_COOKIE_NAME, { path: window.location.pathname });
    }

    Cookies.remove(TOKEN_COOKIE_NAME);
};

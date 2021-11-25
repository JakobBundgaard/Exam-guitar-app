let logoutBtn = document.querySelector('#logutBtn').addEventListener('click', logoutFnk);

async function logoutFnk() {
    console.log("logout")
    await fetch('/users/logout', {
        method: 'POST',
    });
};
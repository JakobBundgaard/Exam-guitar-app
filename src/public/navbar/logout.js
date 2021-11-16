let logoutBtn = document.querySelector('.logout-btn').addEventListener('click', logoutFnk);

async function logoutFnk() {
    console.log("logout")
    await fetch('/users/logout', {
        method: 'POST',
    });
};
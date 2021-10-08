const socket = io()

// Form elements. The $ is a convention for letting people know its an element for the selected DOM 
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormBtn = $messageForm.querySelector("button")

const $messages = document.querySelector("#messages")

const $userList = document.querySelector("#users")


const messageTemplate = document.querySelector('#message-template')
const sidebarTemplate = document.querySelector("#sidebar-template")

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New Message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled
    const scrollOffset = ($messages.scrollTop + visibleHeight) * 2

    if (containerHeight - newMessageHeight < scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("message", (message) => {
    console.log(message)
    let item = messageTemplate.content.querySelector('p')
    item.textContent = message
    $messages.insertAdjacentHTML('beforeend', messageTemplate.innerHTML);
    autoscroll()
})


$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Disabling send btn to avoid sending msg twice => double click etc
    $messageFormBtn.setAttribute("disabled", "disabled")

    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (error) => {

        // Enabling send btn after the event has been aknowledged
        $messageFormBtn.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log("Message delivered")

    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/chat"
    }
})

socket.on('updateUserList', function (users) {
    $userList.innerHTML = ''
    users.forEach(user => {
        $userList.innerHTML += `<li>${user}</li>`
    });
})
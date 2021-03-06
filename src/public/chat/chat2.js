// initialiserer clienten og connecter til serveren
const socket = io()


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

// Recieves the event the server is sending.
socket.on("message", (message) => {
    console.log(message)
    let item = messageTemplate.content.querySelector('p')
    item.textContent = message
    $messages.insertAdjacentHTML('beforeend', messageTemplate.innerHTML);
    autoscroll()
})

socket.on("msg", message => {
    let item = messageTemplate.content.querySelector("p");
    item.textContent = message;
    $messages.insertAdjacentHTML("beforeend", messageTemplate.innerHTML);
    autoscroll();
})


$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Disabling send btn to avoid sending msg twice => double click etc
    $messageFormBtn.setAttribute("disabled", "disabled")

    // message i elements.message kommer fra name placeholderen i chat2.html
    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (error) => {

        // Enabling send btn after the event has been aknowledged
        $messageFormBtn.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        // this is the aknowledgement. it is only sendt if the callback is called in the corresponding event
        console.log("Message delivered")

    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/chat"
    }
})


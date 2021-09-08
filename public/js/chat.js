const socket = io()

//HTML Elements
const form = document.querySelector("#message-form")
const locElement = document.querySelector("#location")
const sidebarSection = document.querySelector("#sidebar")

function autoScroll() {
    messageSection.scrollTop = messageSection.scrollHeight;
}


//Socket events
socket.emit('join', { name, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
    reloadRenderMsg(room)
    console.log('joined')
});


socket.on('activeUsers', ({ room, users }) => {
    const html = Mustache.render(activeUsersTemplate, {
        room,
        users
    })
    sidebarSection.innerHTML = html
    const titleheader = document.querySelector(".sidebar-section>h1")
    titleheader.addEventListener('click', () => {
        console.log(sidebarSection.style.transform)
        if(window.innerWidth<950){
            if (sidebarSection.style.transform == "translateX(100%)" || !sidebarSection.style.transform){
            sidebarSection.style.transform = "translateX(0)"
            titleheader.style.transform="translateX(100%)"
        }
        else{
            sidebarSection.style.transform = "translateX(100%)"
            titleheader.style.transform="translateX(0)"
        }
    }
    })
})

socket.on('message', (msg) => {
    console.log(msg.name)
    let html;
    let message;
    if (!msg.name) {
        message={
            message: msg.message,
            createdAt: moment(msg.createdAt).format('h:mma')
        }
        html = Mustache.render(roomInfoTemplate, message)
    } else if(msg.name==name) {
        message={
            name: msg.name,
            message: msg.message,
            createdAt: moment(msg.createdAt).format('h:mma')
        }
        html = Mustache.render(myMessageTemplate, message)
    }else{
        message={
            name: msg.name,
            message: msg.message,
            createdAt: moment(msg.createdAt).format('h:mma')
        }
        html = Mustache.render(messageTemplate, message)
    }
    let type=msg.name?'message':'info'
    addMsg(room,msg,type)
    messageSection.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('location', (msg) => {
    console.log(msg)
    let html;
    if(msg.name==name){
        html = Mustache.render(myLinkTemplate, {
            name: msg.name,
            link: `https://google.com/maps?q=${msg.latitude},${msg.longitude}`,
            createdAt: moment(msg.createdAt).format('h:mma')
        })
    }else{
        html = Mustache.render(linkTemplate, {
            name: msg.name,
            link: `https://google.com/maps?q=${msg.latitude},${msg.longitude}`,
            createdAt: moment(msg.createdAt).format('h:mma')
        })
    }
    addMsg(room,msg,'location')
    messageSection.insertAdjacentHTML('beforeend', html);
    autoScroll();
})


//Html events
form.addEventListener('submit', (event) => {
    event.preventDefault()
    event.target.elements.send.disabled = true
    let msg = {
        name,
        message: event.target.elements.message.value,
        createdAt: new Date().getTime()
    }
    socket.emit('sendMessage', msg, () => {
        event.target.elements.send.disabled = false
        event.target.elements.message.value = '';
        event.target.elements.message.focus();
        console.log("msg delivered")
    })
})

locElement.addEventListener('click', (event) => {
    event.target.disabled = true
    if (!navigator.geolocation) {
        return alert('not supported in your client side')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            name,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            createdAt: new Date().getTime()
        }, () => {
            event.target.disabled = false
            console.log("location shared")
        })
    })
})



const socket = io()

//HTML Elements
const form = document.querySelector("#message-form")
const locElement = document.querySelector("#location")
const messageSection=document.querySelector("#messages")
const sidebarSection=document.querySelector("#sidebar")

//Templates
const messageTemplate=document.querySelector("#message-template").innerHTML
const linkTemplate=document.querySelector("#link-template").innerHTML
const activeUsersTemplate=document.querySelector("#active-users-template").innerHTML


const {name,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

function autoScroll(){
    messageSection.scrollTop = messageSection.scrollHeight;
}


//Socket events
socket.emit('join',{name,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
    console.log('joined')
});

socket.on('activeUsers',({room,users})=>{
    const html=Mustache.render(activeUsersTemplate,{
        room,
        users
    })
    sidebarSection.innerHTML=html
})

socket.on('message', (msg) => {
    console.log(msg)
    const html=Mustache.render(messageTemplate,{
        name:msg.name,
        message:msg.message,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    messageSection.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

socket.on('location', (msg) => {
    console.log(msg)
    const html=Mustache.render(linkTemplate,{
        name:msg.name,
        link:`https://google.com/maps?q=${msg.latitude},${msg.longitude}`,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    messageSection.insertAdjacentHTML('beforeend',html);
    autoScroll();
})


//Html events
form.addEventListener('submit', (event) => {
    event.preventDefault()
    event.target.elements.send.disabled = true
    let msg = {
        name,
        message:event.target.elements.message.value,
        createdAt:new Date().getTime()
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
            createdAt:new Date().getTime()
        }, () => {
            event.target.disabled = false
            console.log("location shared")
        })
    })
})


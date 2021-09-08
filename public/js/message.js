const messageSection = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const linkTemplate = document.querySelector("#link-template").innerHTML
const activeUsersTemplate = document.querySelector("#active-users-template").innerHTML
const roomInfoTemplate = document.querySelector("#room-info-template").innerHTML
const myMessageTemplate = document.querySelector("#my-message-template").innerHTML
const myLinkTemplate = document.querySelector("#my-link-template").innerHTML


const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

function addMsg(room, message, type) {
    let messages = localStorage.getItem(room)
    if (!messages) {
        messages = []
        messages.push({ type, message })
        localStorage.setItem(room, JSON.stringify(messages))
        return message
    } else {
        messages = JSON.parse(messages);
        messages.push({ type, message })
        localStorage.setItem(room, JSON.stringify(messages))
        return message
    }
}

function reloadRenderMsg(room) {
    let messages = localStorage.getItem(room)
    if (!messages)
    return undefined
    
    messages = JSON.parse(messages)
    messages.forEach(msg => {
        if (msg.type == 'message' || msg.type == 'info') {
            let html;
            let message;
            if (!msg.message.name) {
                message = {
                    message: msg.message.message,
                    createdAt: moment(msg.message.createdAt).format('h:mma')
                }
                html = Mustache.render(roomInfoTemplate, message)
            } else if (msg.message.name == name) {
                message = {
                    name: msg.message.name,
                    message: msg.message.message,
                    createdAt: moment(msg.message.createdAt).format('h:mma')
                }
                html = Mustache.render(myMessageTemplate, message)
            } else {
                message = {
                    name: msg.message.name,
                    message: msg.message.message,
                    createdAt: moment(msg.message.createdAt).format('h:mma')
                }
                html = Mustache.render(messageTemplate, message)
            }
            messageSection.insertAdjacentHTML('beforeend', html);

        } else if (msg.type == 'location') {
            let html;
            if (msg.message.name == name) {
                html = Mustache.render(myLinkTemplate, {
                    name: msg.message.name,
                    link: `https://google.com/maps?q=${msg.message.latitude},${msg.message.longitude}`,
                    createdAt: moment(msg.message.createdAt).format('h:mma')
                })
            } else {
                html = Mustache.render(linkTemplate, {
                    name: msg.message.name,
                    link: `https://google.com/maps?q=${msg.message.latitude},${msg.message.longitude}`,
                    createdAt: moment(msg.message.createdAt).format('h:mma')
                })
            }
            messageSection.insertAdjacentHTML('beforeend', html);
        }
    });
}

function clearRoom(){
    localStorage.setItem(room,'');
    location.href='/';
}
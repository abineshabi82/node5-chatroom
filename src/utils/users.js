let users = []

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //required
    if (!name || !room) {
        return { error: 'name and room are required' }
    }
 
    //is already exist?
    existingUser = users.find(user => user.name === name && user.room === room)
    if (existingUser) {
        return { error: 'this user already exist in this room' }
    }

    //save user
    let user = { id, name, room }
    users.push(user)
    return user
}

const removeUser = (id) => {
    let index = users.findIndex(user => user.id === id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    } else {
        return { error: 'user not present' }
    }
}

const getUser = (id) => {
    const user = users.find(user => user.id === id)
    if (user)
        return user
    else
        return undefined
}

const getRoom=(room)=>{
    room=room.trim().toLowerCase()
    const userList=users.filter(user=>user.room===room)
    return userList
}

module.exports={addUser,removeUser,getUser,getRoom}
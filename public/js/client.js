const socket=io();

var username;
var chats=document.querySelector(".chats");
var user_list=document.querySelector(".user-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");
var inpute = document.getElementById("user-msg");

do{
    username=prompt("Enter Your Name : ");

} while(!username);
// It will be called when user will join

socket.emit("new-user-joined",username);
// Notifying that user is joined

socket.on('user-connected',(socket_name)=>{
      userJoinLeft(socket_name,'joined');
});

// function to create Left/Join Status div
function userJoinLeft(name,status){
   let div=document.createElement("div");
   div.classList.add('user-join');
   let content=`<p><b>${name}</b> ${status} the chat </p>`;
   div.innerHTML=content;
   chats.appendChild(div);
   chats.scrollTop=chats.scrollHeight;

}

// Notifying that user has Left

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'Left');
});
// // For updating users list and users counts

socket.on('user-list',(users)=>{
    user_list.innerHTML="";
    users_arr=Object.values(users);

    for(i=0;i<users_arr.length;i++)
    {
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        user_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;

});

// // For Sending Messages

// const time_Format = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// console.log(time);

inpute.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("user-send").click();
    }
  });

msg_send.addEventListener('click',()=>{
    let data={
        user: username,
        msg: user_msg.value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true,
        }).toLowerCase()
    };
    if(user_msg.value!='')
    {
        appendMessage(data,'outgoing');
        socket.emit('message', data);
        user_msg.value='';
    }
});
function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message', status);
    let content=`
     <h5 id="user_name">${data.user}</h5>
     <p>${data.msg}</p>
     <h5 class="timestamp" id="unique">${data.time}</h5>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
})


function openFullscreen(img) {
    const fullscreen = document.getElementById('fullscreen');
    const fullscreenImg = document.getElementById('fullscreen-img');
    
    // Set the source of the fullscreen image to the clicked image's source
    fullscreenImg.src = img.src;

    // Show the fullscreen overlay
    fullscreen.style.display = 'flex';
}

function closeFullscreen() {
    const fullscreen = document.getElementById('fullscreen');
    fullscreen.style.display = 'none';
}

const socket = io("/");

const videoGrid = document.querySelector("#video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// constructor of Peer is Peer(id, options)

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "40000",
});

let myVedioStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVedioStream = stream;
    addVideoStream(myVideo, stream);
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    peer.on("call", function (call) {
      const video = document.createElement("video");
      call.answer(stream); // Answer the call with an A/V stream.
      call.on("stream", function (userVideoStream) {
        // Show stream in some video/canvas element.
        addVideoStream(video, userVideoStream);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  // console.log("user Connected") ;
  console.log(userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const myMessage = document.querySelector("#myMessage");
const messagesArea = document.querySelector("#messagesArea") ; 
myMessage.addEventListener("keydown", (e) => {
  if (e.which == 13 && myMessage.value.length !== 0) {
    socket.emit("message", myMessage.value);
    myMessage.value = "";
  }
});

socket.on("createMessage", (message) => {
  console.log(message);
  let currentMessage = document.createElement('li') ; 
  currentMessage.innerText = message ; 
  messagesArea.append(currentMessage)
});

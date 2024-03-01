var socket = io("http://localhost:3000");

socket.on("user connected", (user) => {
  console.log(user);
});

socket.on("addUsers", (user) => {
  //if (userName === user) return;

  Toastify({
    text: `New User Added : ${user}`,
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  console.log(users);
});
socket.on("caret-position", ({ userName, address, offset }) => {
  //if (userName === user) return;
  InsertElementUsingRange(address, offset);

  console.log(users);
});

function addUsers(userName) {
  socket.emit("addUsers", userName);
}

function broatcastCaretPosition(obj) {
  socket.emit("caret-position", obj);
}

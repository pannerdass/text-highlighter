//Model Configuration

swal("Enter Your Name", {
  content: "input",
}).then((value) => {
  onUsernameSelection(value);
  //console.log(value);
});

function onUsernameSelection(name) {
  userName = name;
  document.getElementById("user-id").innerHTML = userName;
  addUsers(userName);
}

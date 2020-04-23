const button = document.getElementById("close");
const modal = document.getElementById("modal");
const alert = document.getElementsByClassName("alert")[0];
const updatealert = document.getElementsByClassName('alert')[0];

setTimeout(() => {
    updatealert.remove();
}, 5000);
alert.style.color="red";

if(button)
button.addEventListener('click', event => {
    modal.style.display = 'none';
});
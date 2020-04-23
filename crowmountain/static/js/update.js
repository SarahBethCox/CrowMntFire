var errorsArr = [];
var errorsList;
var form = document.getElementById("updateform");

function FormValidator(){
    ValidateEmail(form.email.value);
    ValidatePhoneNumber(form.phoneNumber.value);
    ValidateAge(form.age.value);
    if(form.firstName.value =='' ){
        errorsArr.push("First Name");
    }
    else if(form.lastName.value== ''){
        errorsArr.push("Last Name");
    }
    
    if(errorsArr.length===0){
       
        form.submit();
        
    }
    else{
        setTimeout(() => {
            if(errorsArr.length>0 )
            DisplayError();}, 1000);
    }
}


function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){

    }
    else {
        errorsArr.push("email");

    }
}

function ValidatePhoneNumber(phone){
    if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone) && phone.length==10){
        
    }
    else {
    errorsArr.push("phone")

    }
}

function ValidateAge(){
    if(form.age.value>17 &&form.age.value <61){
    }
    else{
        errorsArr.push("age")

    }

}

function DisplayError(){

    if(errorsArr.length===1) {
        errorsList =  errorsArr;
    }
    else if(errorsArr.length===2){
    errorsList =  errorsArr.slice(0,1)+' and ' + errorsArr.slice(-1);
    }
    else{
        errorsList =  errorsArr.slice(0, -1).join(', ') + ', and ' + errorsArr.slice(-1);
    }
    
    document.getElementById("alertMsg").insertAdjacentHTML("afterbegin",'<div class="alert alert-danger" style="" class="close " role="alert"> Please enter a valid ' +errorsList+ '.</div>');           
    setTimeout(() => {
        document.getElementById("alertMsg").firstChild.remove();
    }, 4000);
    errorsArr=[];
    errorsList =[];
}

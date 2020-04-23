
    var fullAddress ;
    var distance;
    var temp1;
    var temp2;
    var errorsArr = [];
    var errorsList;
    var betweenRadius =false;
    var errorflag = false;
    var form = document.getElementById("volunteerForm");
    var button = document.getElementById("close");
    var modal = document.getElementById("modal");
    var alert = document.getElementsByClassName("alert")[0];
    var updatealert = document.getElementsByClassName('alert')[0];
    var volunteerIDForm = document.getElementById("volunteerIDForm");
    if(updatealert){
setTimeout(() => {
    updatealert.remove();
}, 5000);
alert.style.color="red";
    }
if(button)
button.addEventListener('click', event => {
    modal.style.display = 'none';
});


function FormValidator(){
    alertMsg=false;

    fullAddress = form.volunteerAddress.value+ " " + form.city.value + " " + "Arkansas" +" "+ form.zipCode.value ;
    
    ValidateEmail(form.email.value);
    ValidatePhoneNumber(form.phoneNumber.value);
    ValidateAge(form.age.value);
    
    if(form.volunteerAddress.value!==''){
        var service = new google.maps.DistanceMatrixService;
        var vm =this;
        
        service.getDistanceMatrix({
            origins: ["1432 Crow Mountain Rd, Russellville, AR 72802"],
            destinations: [fullAddress],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.imperial,
            avoidHighways: false,
            avoidTolls: false
        },callback);
    }
    else if(form.volunteerAddress.value == ''){
        errorsArr.push("address");
    }

    function callback(res, status)
    {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        } 
        else {
            //Assigns distance value which is of type string (eg. 9,8 mi)
            distance = res.rows[0].elements[0].distance.text;
            //Removes "mi" from the string
            distance = distance.substring(0, distance.length-2);
            //Returns the intex of the "," character
            str = distance.indexOf(",");
            //Assigns the string of characters before the "," to temp1 variable. 
            temp1 = distance.substring(0,str);
            //Assigns the string of characters after the "," to temp2 variable 
            temp2 = distance.substring(str+1,distance.length);
            //The distance vairable can now be used as a number.
            distance = temp1 + temp2;
        
            if(distance>20){
                document.getElementById("alertMsg").insertAdjacentHTML("afterbegin",'<div class="alert alert-danger" style=" id="errorMiles" class="close " role="alert">We are sorry but, you must live between a 20 mile radius</div>');
                errorflag = true;
                setTimeout(() => {
                    document.getElementById("alertMsg").firstChild.remove();
                }, 7000);
            }
            else if(errorsArr.length===0){
                form.submit();
            }
        }   
    }


    setTimeout(() => {
        if(errorsArr.length>0 && errorflag===false)
        DisplayError();}, 1000);
}

function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){

    }
    else if(betweenRadius ===false){
        errorsArr.push("email");

    }
}

function ValidatePhoneNumber(phone){
    if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone) && phone.length==10){
        
    }
    else if(betweenRadius ===false){
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



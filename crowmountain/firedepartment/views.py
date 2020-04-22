from django.shortcuts import render
from .models import Citizen
from django.http import HttpResponseRedirect
from django.urls import reverse
import uuid
from .models import Volunteer
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.contrib import messages

#Sendgrid imports
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
#####################################

# Create your views here.
def index(request):
    return render(request, 'pages/home.html')

def aboutus(request):
    return render(request, 'pages/aboutus.html')

def contactus(request):
    return render(request, 'pages/contactus.html')
def volunteer(request, status, email ):
    print("hoal")

def volunteer(request):
   

    if request.POST.get("came_from")=="updateform":
        firstname = request.POST.get("firstName")
        lastname = request.POST.get("lastName")
        address = request.POST.get("volunteerAddress")
        age = request.POST.get("age")
        phone = request.POST.get("phoneNumber")
        email = request.POST.get("email")
        volunteerid =request.POST.get("volunteerid")
        if(Citizen.objects.filter(CitizenID=volunteerid).update(First_Name=firstname, Last_Name=lastname, Phone=phone, Address=address,Age=age, Email=email)):
            messages.success(request, 'Your information was sucessfully updated!', extra_tags='updatesucess')
            url = reverse('volunteer')
            return HttpResponseRedirect(url) 

        messages.error(request, 'There was a problem and you information was not updated', extra_tags='updateerror')
        url = reverse('volunteer')
        # request.session['posted_page_visited'] = True
        return HttpResponseRedirect(url) 

    elif request.POST.get("came_from")=="volunteerform":
        firstname = request.POST.get("firstName")
        lastname = request.POST.get("lastName")
        address = request.POST.get("volunteerAddress")
        city = request.POST.get("city")
        zipcode = request.POST.get("zipCode")
        age = request.POST.get("age")
        phone = request.POST.get("phoneNumber")
        email = request.POST.get("email")
        
        fulladdress = address + " " + city + ", AR " + zipcode
        citizendata = Citizen(First_Name=firstname, Last_Name=lastname, Phone=phone, Address=fulladdress,Age=age, Email=email)
        # citizendata.save()
        # citizen = citizendata

        # volunterdata = Volunteer(Citizen=citizen, Acceptance_Status="Accepted")
        # volunterdata.save()
       
        message = Mail(
        from_email=email,
        to_emails='hescalante@atu.edu',
        subject='New Volunteer',
        html_content='<strong>Hola</strong>')
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            # response = sg.send(message)
            # status = response.status_code
            status=202
            if status==202:
                messages.success(request, email, extra_tags='email')
                messages.success(request, firstname, extra_tags='firstname')
            else:
                messages.error(request, 'Failed')
        except Exception as e:
            print(e)        
        url = reverse('volunteer')
        return HttpResponseRedirect(url) 
           
    elif request.POST.get("came_from")=="volunteerIDForm":
        print("from same s")
        citizens = Citizen.objects.all()
        vid=request.POST.get("volunteerID")
        try:
            volunteer = citizens.get(CitizenID=vid)
        except Exception as e:
            return render(request, 'pages/volunteer/volunteer.html', {"errormsg":"Invalid ID"})
    
        return render(request, 'pages/volunteer/update.html', {'volunteer':volunteer})


    return render(request, 'pages/volunteer/volunteer.html')

def volunteerform(request):
    return render(request, 'pages/volunteer/form.html')

def updateform(request):
    return render(request, 'pages/volunteer/update.html', {'volunteer':volunteer})

def burnnotice(request):
    return render(request, 'pages/burnnotice/burnnotice.html')

def events(request):
    return render(request, 'pages/events.html')

def educational(request):
    return render(request,'pages/educational.html')

def loginPage(request):
    if request.user.is_authenticated:
        return redirect('administrator')
    else:
        if(request.method=='POST'):
            username = request.POST.get("username")
            password = request.POST.get("password")
            admin = authenticate(request, username=username,password=password)
            if admin is not None:
                login(request, admin)
                return redirect('administrator')
            else:
                messages.info(request, "Wrong email/password")

    return render(request,'pages/admin/login.html')


def adminLogout(request):
    logout(request)
    return redirect("login")

@login_required(login_url='login')

def administrator(request):
    asc = request.POST.get('asc')
    citizens = Citizen.objects.all()
    searchedValue="Search"
    searchedValue = request.POST.get("search")
    #Gets all Citizens objects that exist in the Volunter model 
    volunteers = Volunteer.objects.filter(Citizen__in=citizens)
    vid=request.POST.get('vid')
    print(request.POST)
    
    if request.POST.get("remove"):
        Citizen.objects.filter(CitizenID=vid).delete()
    if request.POST.get("search"):
        citizens = Citizen.objects.filter(Q(First_Name__contains=request.POST.get("search")) | Q(Last_Name__contains=request.POST.get("search"))| Q(Email__contains=request.POST.get("search"))| Q(Phone__contains=request.POST.get("search"))  )
        volunteers = Volunteer.objects.filter(Citizen__in=citizens)
        return render(request, 'pages/admin/adminpanel.html', {'volunteers':volunteers,'searchedValue':searchedValue})
    if request.POST.get("dropdown"):
        print(request.POST.get("vid"))
        Volunteer.objects.filter(id=vid).update(Acceptance_Status=request.POST.get("dropdown"))
    if request.POST.get("filterbyageform"):
        if  asc =='None' or asc=='False':
            volunteers = Volunteer.objects.all().order_by('Citizen__Age')
            asc =True
        elif asc =='True':
            volunteers = Volunteer.objects.all().order_by('-Citizen__Age')
            asc =False
    if request.POST.get("filterbystatusinput"):
        if  asc =='None' or asc=='False':
            volunteers = Volunteer.objects.all().order_by('Acceptance_Status')
            asc =True
        elif asc =='True':
            volunteers = Volunteer.objects.all().order_by('-Acceptance_Status')
            asc =False
    
    

    return render(request, 'pages/admin/adminpanel.html', {'volunteers':volunteers, 'isasc':asc, 'searchedValue':searchedValue})
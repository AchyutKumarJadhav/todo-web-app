// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import $ from "jquery";

$(function(){

    function LoadComponent(page){
        $.ajax({
            method: 'get',
            url : page,
            success : (response)=>{
                $("main").html(response);
            }
        })
    }

    function LoadAppointments(uid){
        $("#appointmentsContainer").html("");
        $.ajax({
            method :"get",
            url: `http://localhost:4000/appointments/${uid}`,
            success : (appointments)=>{
                $("#UserIdContainer").append(`<span>${sessionStorage.getItem("username")}</span>`);
                appointments.map(item=>{
                    $(`
                        <div class="alert alert-dismissible alert-success">
                           <h2>${item.Title}</h2>
                           <button value=${item.Id} id="btnDelete" class="btn btn-close"></button>
                           <p>${item.Description}</p>
                           <div>
                               <span class= "bi bi-clock"></span> ${item.Date}
                           </div>
                           <div class = "text-end">
                                <button value=${item.Id} id="btnEdit" class=" btn btn-warning bi bi-pen">Edit</button>
                           </div>
                        </div>
                    `).appendTo("#appointmentsContainer");
                })
            }
         })
    }

    $("#btnHomeLogin").click(()=>{
        LoadComponent('login.html');
    })

    $("#btnHomeRegister").click(()=>{
        LoadComponent('register.html');
    })

    $(document).on("click", "#btnNavRegister", ()=>{
        LoadComponent('register.html');
    })
    $(document).on("click", "#btnNavLogin", ()=>{
        LoadComponent('login.html');
    })
    $(document).on("click", "#btnLogin", ()=>{
        $.ajax({
            method :'get',
            url: 'http://localhost:4000/users',
            success : (users)=>{
               
                var user = users.find(item => item.UserId===$("#UserId").val());
                if(user.Password===$("#Password").val())
                {
                    sessionStorage.setItem("username", user.UserName);
                    sessionStorage.setItem("userid",user.UserId);
                    
                    LoadComponent('appointments.html');
                    LoadAppointments($('#UserId').val());
                     
                }else{
                    $("#lblError").html('Invalid details');
                }
            }
        })
    })

    $(document).on("click", "#btnSignout", ()=>{
        sessionStorage.removeItem("username");
        LoadComponent('login.html');
    })

    //Register Button Logic

    $(document).on("click", "#RbtnRegister", ()=>{
        var user= {
            UserId: $("#RUserId").val(),
            UserName: $("#RUserName").val(),
            Password: $("#RPassword").val(),
            Email: $("#REmail").val(),
            Mobile: $("#RMobile").val(),
        };      

            $.ajax({
                method : "post",
                url: 'http://127.0.0.1:4000/register-user',
                data: user
            })
              alert('Registered Successfully');
              LoadComponent('login.html');
      
    })
        //to verify new user
    $(document).on("keyup", "#RUserId", ()=>{
        var VerifyUser = $("#RUserId").val();
        $.ajax({
            method : 'get',
            url: 'http://127.0.0.1:4000/users'
        }).then(data=>{
               for(var user of data){
                if(user.UserId == VerifyUser){
                    $("#userError").html('User id  taken - try another').css('color','red')
                    break;
                }else{
                    $("#userError").html('User id Available').css('color','green')
                }
            }
        })
    })

    $(document).on("click", "#btnNewAppointment", ()=>{
        LoadComponent('new-appointments.html');
    })

     //Adding new Appointments

    $(document).on("click", "#btnAddNewTask", ()=>{
        var appointment = {
            Id : $('#AId').val(),
            Title : $('#ATitle').val(),
            Description : $('#ADescription').val(),
            Date : $('#ADate').val(),
            UserId : sessionStorage.getItem("userid")
        }
        $.ajax({
            method : "post",
            url : 'http://127.0.0.1:4000/add-task',
            data: appointment
        })
        alert('Appointment Added successfully...');
        LoadComponent('appointments.html');
        LoadAppointments(appointment.UserId);
    })

        //Delete Appointments

    $(document).on("click", "#btnDelete", (e)=>{
        var flag = confirm('Are you sure \n Want to delete?');
        if(flag ==true){
            $.ajax({
                method: 'delete',
                url : `http://127.0.0.1:4000/delete-task/${e.target.value}`
            })
            alert('Deleted Successfully');
            LoadAppointments(sessionStorage.getItem('userid'));
        }
    })

    //Edit Appointments

    $(document).on("click", "#btnEdit", (e)=>{
        LoadComponent('edit-appointment.html');
        $.ajax({
            method : 'get' , 
            url : `http://127.0.0.1:4000/get-byid/${e.target.value}`,
            success : (appointments) =>{
                $("#ETitle").val(appointments[0].Title);
                $("#EDescription").val(appointments[0].Description);
             //   $("#EDate").val(appointments[0].Date);
            }
        })
    })

    // Save Edited Changes

    $(document).on("click", "#btnSave", (e)=>{
        $.ajax({
            method :'put', 
            url : `http://127.0.0.1:4000/edit-task/${e.target.value}`,
            success : (appointments) =>{
                LoadComponent('edit-appointment.html');
            }
        })
    })
})
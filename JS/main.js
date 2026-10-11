var fullName = document.getElementById('fullName')
var phoneNumber = document.getElementById('phoneNumber')
var emailAddress = document.getElementById('emailAddress')
var address = document.getElementById('address')
var group = document.getElementById('group')
var notes = document.getElementById('notes')
var favoriteCheck = document.getElementById('favoriteCheck')
var emergencyCheck = document.getElementById('emergencyCheck')
var productRow =document.getElementById('contactsList')
var addBtn =document.getElementById('addBtn')
var updateBtn =document.getElementById('updateBtn')


var productList =[];
if(localStorage.getItem('list')){
    productList=JSON.parse(localStorage.getItem('list'))
    display()
}


function creatProduct(){


     var nameValue = fullName.value.trim();
    if (nameValue === "") {
        Swal.fire({
            title: "Missing Name!",
            text: "Please enter your full name.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }

    var phoneValue = phoneNumber.value.trim();
    if (phoneValue === "") {
        Swal.fire({
            title: "Missing Phone Number!",
            text: "Please enter your phone number.",
            icon: "warning",
            confirmButtonText: "OK"
        });
        return;
    }
     var phoneRegex = /^(?:\+20|0020|0)?1[0125]\d{8}$/;
       if (!phoneRegex.test(phoneValue)) {
        Swal.fire({
            title: "Invalid Phone Number!",
            text: "Please enter a valid Egyptian mobile number.",
            icon: "error",
            confirmButtonText: "Try Again"
        });
        return;
    }

 
    var productObj = {
        pName:fullName.value,
        pPhone:phoneNumber.value,
        pEmail:emailAddress.value,
        pAdress:address.value,
        pGroup:group.value,
        pNotes:notes.value,
        pFavorite:favoriteCheck.checked,
        pEmergency:emergencyCheck.checked,
    }
    productList.push(productObj);
    localStorage.setItem('list',JSON.stringify(productList))
    display();
    clearForm();

    Swal.fire({
        title: "Added!",
        text: "Contact has been added successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000
    });

    var modalElement = document.getElementById('addContactModal');
    var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();

}

function clearForm(){
       fullName.value =''
       phoneNumber.value = ''
       emailAddress.value = ''
       address.value=''
       group.value = ''
       notes.value = ''
       favoriteCheck.checked = false
       emergencyCheck.checked = false

    }




function display() {
    var box = '';
    var favoritesBox = '';
    var emergencyBox = '';
    for (var i = 0; i < productList.length; i++) {
        var p = productList[i];
        var initials = p.pName
            ? p.pName.trim().charAt(0).toUpperCase()
            : '?';
        box += `
        <div class="col-12 col-md-6">
            <div class="contact-card">
                <div class="contact-body">
                    <div class="d-flex gap-3 align-items-start">
                        <div class="contact-avatar">
                            ${initials}
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="fw-bold mb-2">${p.pName}</h5>
                            <p class="contact-detail">
                                <i class="fa-solid fa-phone text-primary"></i>
                                ${p.pPhone}
                            </p>
                            <p class="contact-detail">
                                <i class="fa-solid fa-envelope text-primary"></i>
                                ${p.pEmail || 'No email'}
                            </p>
                            <p class="contact-detail">
                                <i class="fa-solid fa-location-dot text-success"></i>
                                ${p.pAdress || 'No address'}
                            </p>
                            ${p.pGroup ? `
                                <span class="badge bg-light text-dark">
                                    ${p.pGroup}
                                </span>` : ''}
                            ${p.pEmergency ? `
                                <span class="badge bg-danger-subtle text-danger">
                                    Emergency
                                </span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="contact-footer">
                    <button class="action-btn call-btn"
                        onclick="window.location.href='tel:${p.pPhone}'">
                        <i class="fa-solid fa-phone"></i>
                    </button>
                    <button class="action-btn email-btn"
                        onclick="window.location.href='mailto:${p.pEmail}'">
                        <i class="fa-solid fa-envelope"></i>
                    </button>
                    <div class="flex-grow-1"></div>
                    <button class="action-btn favorite-btn"
                        onclick="toggleFavorite(${i})"
                        title="Favorite">
                        <i class="fa-${p.pFavorite ? 'solid' : 'regular'} fa-star"></i>
                    </button>
                    <button class="action-btn emergency-btn"
                        onclick="toggleEmergency(${i})"
                        title="Emergency">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </button>
                    <button class="action-btn edit-btn"
                        onclick="handleUpdata(${i})"
                        title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete-btn"
                        onclick="deleteFun(${i})"
                        title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;

        if (p.pFavorite) {
            favoritesBox += `
            <div class="side-contact">
                <div class="side-avatar">${initials}</div>
                <div class="flex-grow-1">
                    <div class="fw-semibold">${p.pName}</div>
                    <small class="text-secondary">${p.pPhone}</small>
                </div>
                <a class="side-call" href="tel:${p.pPhone}">
                    <i class="fa-solid fa-phone"></i>
                </a>
            </div>`;
        }

        if (p.pEmergency) {
            emergencyBox += `
            <div class="side-contact">
                <div class="side-avatar">${initials}</div>
                <div class="flex-grow-1">
                    <div class="fw-semibold">${p.pName}</div>
                    <small class="text-secondary">${p.pPhone}</small>
                </div>
                <a class="side-call emergency-call"
                    href="tel:${p.pPhone}">
                    <i class="fa-solid fa-phone"></i>
                </a>
            </div>`;
        }
    }

    productRow.innerHTML = box;
    document.getElementById('totalCount').innerText =
        productList.length;
    document.getElementById('totalText').innerText =
        productList.length;
    document.getElementById('favoritesCount').innerText =
        productList.filter(p => p.pFavorite).length;
    document.getElementById('emergencyCount').innerText =
        productList.filter(p => p.pEmergency).length;
    document.getElementById('favoritesList').innerHTML =
        favoritesBox || `
        <p class="text-center text-secondary py-4">
            No favorite contacts yet.
        </p>`;
    document.getElementById('emergencyList').innerHTML =
        emergencyBox || `
        <p class="text-center text-secondary py-4">
            No emergency contacts
        </p>`;
}



function toggleFavorite(index) {
    productList[index].pFavorite =
        !productList[index].pFavorite;

    localStorage.setItem('list', JSON.stringify(productList));
    display();
}

function toggleEmergency(index) {
    productList[index].pEmergency =
        !productList[index].pEmergency;

    localStorage.setItem('list', JSON.stringify(productList));
    display();
}




function deleteFun(index){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
     productList.splice(index,1)
    localStorage.setItem('list',JSON.stringify(productList))
    display();
  
    
    
    
    Swal.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  }
});


   
};

var globalFun ;
function handleUpdata(index){
    globalFun =index;
    fullName.value =productList[index].pName
    phoneNumber.value =productList[index].pPhone
    emailAddress.value =productList[index].pEmail
    address.value =productList[index].pAdress
    group.value =productList[index].pGroup
    notes.value =productList[index].pNotes
    favoriteCheck.checked =productList[index].pFavorite
    emergencyCheck.checked = productList[index].pEmergency

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')

     
    document.getElementById('addContactModalLabel').innerText = 'Edit Contact';
    var modalElement = document.getElementById('addContactModal');
    var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();

}

function UpdataFun(){
    
    productList[globalFun].pName = fullName.value
    productList[globalFun].pPhone = phoneNumber.value
    productList[globalFun].pEmail = emailAddress.value
    productList[globalFun].pAdress = address.value
    productList[globalFun].pGroup = group.value
    productList[globalFun].pNotes = notes.value
    productList[globalFun].pFavorite = favoriteCheck.checked
    productList[globalFun].pEmergency = emergencyCheck.checked

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')



    localStorage.setItem('list',JSON.stringify(productList))
    display();
}
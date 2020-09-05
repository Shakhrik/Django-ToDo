const wrapper = document.getElementById("list-wrapper");
const taskForm = document.querySelector("#form-wrapper");

  // This function for csrf token for fetch headers
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    let activeItem = null;



  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let url = '/api/task-create'
    const title = document.getElementById('title')
    if(activeItem != null){
      url = `/api/task-update/${activeItem.id}/`
      activeItem = null
    }
    fetch(url,{
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken

      },
      body:JSON.stringify({
        'title':title.value
      })
    }).then(response=>{
      buildList()
    })
    title.value = ''
    title.focus()
  });






function buildList() {
  wrapper.innerHTML = ''
  fetch('/api/task-list')
    .then((resp) => {
      return resp.json();
    })
    .then((list) => {
      for (var i in list) {
        let title =  `<span class="title">${list[i].title}</span>`
        if(list[i].completed == true){
          title =  `<strike class="title">${list[i].title}</strike>`
        }


        var item = `
            <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                <div style="flex:7">
                    ${title}
                </div>
                <div style="flex:1">
                  <button id="editButton" class="btn btn-sm btn-outline-info edit">Edit</button>
                </div>
                <div style="flex:1">
                  <button class="btn btn-sm btn-outline-dark delete">Delete</button>
                </div>
            </div> `;
        wrapper.innerHTML += item;
      } // End for


      for(const i in list){
        const editBtn = document.getElementsByClassName('edit')[i]
        const deleteBtn = document.getElementsByClassName('delete')[i]
        const strike = document.getElementsByClassName('title')[i]

        editBtn.addEventListener('click', (function(item){
          // console.log("ITEM:",item)
          return function(){
              editItem(item)
          }
          })(list[i]))

          

          // Delete
          deleteBtn.addEventListener('click', (function(item){
            return function(){
                deleteItem(item)
                
            }
            })(list[i])) // endfor deleteBtn addEventListener


             // Strike
          strike.addEventListener('click', (function(item){
            return function(){
               strikeUnstrike(item)
              
          }
          })(list[i])) // endfor strikeBtn addEventListener 
          } // endfor


       
    });
}

buildList();

function editItem(item){
  activeItem = item
  document.getElementById('title').value = activeItem.title
}


function deleteItem(item){
  console.log('Delete clicked')
  fetch(`/api/task-delete/${item.id}/`,{
    method:'DELETE',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken
    }
  }).then(res=>{
    buildList()
  })
}


function strikeUnstrike(item){
  console.log('strike clicked')
  item.completed = !item.completed


  fetch(`/api/task-update/${item.id}/`,{
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken
    },
    body:JSON.stringify({'title':item.title, 'completed':item.completed})
  }).then(res=>{
    buildList()
  })
}

// var courseApi = 'http://localhost:3000/courses'

// fetch(courseApi)
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(courses){   
//         console.log(courses);
//     });


var courseApi = 'http://localhost:3000/courses'

function start() {
    getCourses(function(courses){
        rederCourses(courses);
    })

    handleCreateForm();
}

start();

// Functions
function getCourses(callback) {
    fetch(courseApi)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function rederCourses(courses) {
    var listCourseBlock = document.querySelector('#list-courses');

    var htmls = courses.map(function(course){
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">Delete</button>
                <button onclick="handleUpdateCourse(${course.id})">Update</button>
            </li>
        `;
    });
    listCourseBlock.innerHTML = htmls.join('');
}

function createCourse(dataForm, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    }

    fetch(courseApi, options)
        .then(function (response) {
            return response.json()
        })
        .then(callback)
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create')
    createBtn.onclick = () => {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;

        var dataForm = {
            name: name,
            description: description
        };

        createCourse(dataForm, () => {
            getCourses(rederCourses)
        });
    }
}

function handleDeleteCourse(id) {
    var option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(courseApi + `/${id}`, option)
        .then((response) => response.json())
        // Xóa load lại dữ liệu
        // .then(() => getCourses(renderCourses))

    //Xóa DOM
    .then(() => {
        var courseItem = document.querySelector(`.course-item-${id}`)
        if(courseItem) {
            courseItem.remove()
        }
    })
}

function updateCourse(id, data, callback) {
    var option = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(courseApi + `/${id}`, option)
        .then(response => response.json())
        .then(callback)
}

function handleUpdateCourse(id) {
    var option = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(courseApi + `/${id}`, option)
        .then((response) => response.json())
        
    .then(() => {
        var saveCourse = document.querySelector(`#create`)
        saveCourse.classList.replace('create','save')
        saveCourse.innerHTML = "Save"
        var courseItem = document.querySelector(`.course-item-${id}`)
        var name = document.querySelector('input[name="name"]')
        var description = document.querySelector('input[name="description"]')
            name.value = courseItem.querySelector('h4').textContent
            description.value = courseItem.querySelector('p').textContent
            saveCourse.onclick = () => {
                var dataForm = {
                    name: name.value,
                    description: description.value
                }
                updateCourse(id, dataForm, () => {
                    getCourses(rederCourses)
                })
                var createBtn = document.querySelector('.save')
                createBtn.classList.replace('save','create')
                createBtn.innerHTML = "Create"
                createBtn.onclick = () => {
                    handleCreateForm()
                }
            }
    });
}
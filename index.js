let url= 'https://659cb84d633f9aee7907dc49.mockapi.io/week12api/Recruitment'

class Employee {
    constructor(name) {
        this.name = name;
        this.emails = [];
    }

    addEmail(name) {
        this.emails = this.emails || [];
        this.emails.push(new Email(name));
    }
}

class Email {
    constructor(name) {
        this.name = name;
    }
}

class EmployeeService {
    static url = 'https://659cb84d633f9aee7907dc49.mockapi.io/week12api/Recruitment'

    static getAllEmployees() {
        return $.get(this.url)
            .then(data => {
                if (Array.isArray(data)) {
                    return data;
                } else {
                    console.error("API response is not an array:", data);
                    return [];
                }
            })
            .catch(error => {
                console.error("Error fetrching employees:", error);
            });
    }

    static getEmployee(id) {
        return $.get(this.url + `/${id}`);
    }

    static createEmployee(employee){
        return $.post(this.url, employee);
    }

    static updateEmployee(employee) {
        return $.ajax({
            url: this.url + `/${employee._id}`,
            dataType: 'json',
            data: JSON.stringify(employee),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteEmployee(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


class DOMManager {
    static employees;

    static getAllEmployees() {
        EmployeeService.getAllEmployees().then(employees => this.render(employees));
    }
    static createEmployee(name) {
        EmployeeService.createEmployee(new Employee(name))
        .then(() => {
            return EmployeeService.getAllEmployees();
        })
        .then((employees) => this.render(employees));
    }

    static deleteEmployee(id) {
        EmployeeService.deleteEmployee(id)
           .then(() => {
             return EmployeeService.getAllEmployees();
           })
           .then((employees) => this.render(employees));
    }

    static addEmail(id) {
        for (let employee of this.employees) {
            if (employee._id== id) {
              employee.emails.push(new Email($(`#${employee._id}-email-name`).val(), $(`#{employee._id}-email`).val()));
              EmployeeService.updateEmployee(employee)
              .then(() => {
                return EmployeeService.getAllEmployees();
              })
              .then((employees) => this.render(employees));                
              }
            }
        }

        static deleteEmail(employeeId, emailId) {
            for (let employee of this.employees) {
                if (employee._id == employeeId) {
                    for (let email of employee.emails) {
                        if (email._id ==emailId) {
                            employee.emails.splice(employee.emails.indexOf(email), 1);
                            EmployeeService.deleteEmployee(employeeId)
                            .then(() => {

                                return EmployeeService.getAllEmployees();
                            })
                            .then((employees) => this.render(employees));
                        }

                    }
                }
            }
        }

    static render(employees) {
        this.employees = employees;
        $('#app').empty();

        for (let employee of employees) {

            $('#app').prepend(
                `<div id="${employee._id}" class="card">
                    <div class="card-header">
                        <h2>${employee.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteEmployee('${employee._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${employee._id}-email-name" class="form-control" placeholder="Email Name">
                                </div>
                            </div>
                        </div>
                        <button id="${employee._id}-new-email" onclick="DOMManager.addEmail('${employee._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div><br>`
            );
                for (let email of employee.email) {
                    $(`#${employee._id}`).find('.card-body').append(
                        `<p>
                            <span id="name-${employee._id}"><strong>Email: </strong>${email.name}</span>
                            <button class="btn btn-danger" onclick="DOMManager.deleteEmail('${employee._id}', '${email._id}')">Delete Email</button>
                        </p>`
                    );
                }
        }
    }
}

$('#create-new-employee').click(() => {
    DOMManager.createEmployee($('#new-employee').val());
    $('#new-employee-name').val('');
});

 DOMManager.getAllEmployees();

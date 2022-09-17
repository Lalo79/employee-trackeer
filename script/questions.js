const inquirer = require("inquirer");


const firstQuestions = [
    {
    type: 'list',
    name: 'action',
    message: '\n\nWhat do you want to do?',
    choices: ['View Table Contents', 'Add Info', 'Update Employee Info', 'Query Info']
    },
    {
    type: 'list',
    name: 'view',
    message: 'What table do you want to view?',
    choices: ['Department', 'Role', 'Employee'],
    when: (answers) => answers.action == "View Table Contents"
    },
    {
    type: 'list',
    name: 'add',
    message: 'Do you want to add a Department, Role or an Employee?',
    choices: ['Department','Role', 'Employee'],
    when: (answers) => answers.action == "Add Info"
    },
    {
    type: 'list',
    name: 'update',
    message: 'Do you want to update the employee role or manager?',
    choices: ['Update Role', 'Update Manager'],
    when: (answers) => answers.action == "Update Employee Info"
    },
// Add Department
    {
    type: 'input',
    name: 'addDepartment',
    message: 'Please enter de name of the new Department',
    when: (answers) => answers.add == "Department"
    },
    {
    type: 'list',
    name: 'queries',
    message: 'Please indicate the Query you want to execute',
    choices: ['Emplyees by Manager', 'Employees by Department', 'Department Utilized Budget'],
    when: (answers) => answers.action == "Query Info"
    },
]


const  addRoleQuestions = (params) => { 

    const questions = [
        {
        type: 'input',
        name: 'addRoleName',
        message: 'Please enter de name of the new Role',
        },
        {
        type: 'input',
        name: 'addRoleSalary',
        message: 'Please enter de salary for the new role',
        },
        {
        type: 'list',
        name: 'addRoleDepartment',
        choices: params,
        message: 'Please enter de name of the department the role will be part of?',
        },
    ]

    return questions;
}


const addEmployeeQuestions = (rolesList, managerList) => { 

    questions = [
        {
        type: 'input',
        name: 'addFistName',
        message: 'Please enter de first name of the new Employee',
        },
        {
        type: 'input',
        name: 'addSecondName',
        message: `Please enter employee's last name`,
        },
        {
        type: 'list',
        name: 'addRoleEmployee',
        choices: rolesList,
        message: 'Please enter de name of the role of the new employee',
        },
        {
        type: 'list',
        name: 'addManagerEmployee',
        choices: managerList,
        message: 'Please enter de manager that the new employee will report to',
        }

    ]

    return questions;

}


const updateEmployeeQuestions  = (action, employeeList, optionList) => {

    return questions = [
        {
        type: 'list',
        name: 'Employee',
        choices: employeeList,
        message: '\nPlease select the employee whose info will be updated\n',
        },
        {
        type: 'list',
        name: 'updateEmployeeRole',
        choices: optionList,
        message: `\nPlease select the employee's new role\n`,
        when: action == 'Update Role',
        },
        {
        type: 'list',
        name: 'updateEmployeeManager',
        choices: optionList,
        message: `\nPlease select the employee's new manager\n`,
        when: action == 'Update Manager',
        }
    ]
}


const employeesByManagersQuestion = (managerList) => {
    
    return question  = [
        {
        type: 'list',
        name: 'manager',
        message: 'Select the manager of the team you want to view',
        choices: managerList,
        },
    ]
}


const employeesByDepartmentQuestion = (departmentList) => {
    
    return question  = [
        {
        type: 'list',
        name: 'department',
        message: 'Select the department of the team you want to view',
        choices: departmentList,
        },
    ]
}


const firstQuestionaire = async () => {
    return inquirer.prompt(firstQuestions)
};

const addRoleQuestionaire = async (params) => {
    return inquirer.prompt(addRoleQuestions(params));
};

const addEmployeeQuestionaire = async (rolesList, managerList) => {
    return inquirer.prompt(addEmployeeQuestions(rolesList, managerList))
};

const continueQuestionaire = async () => {
    return inquirer.prompt(continueProcess)
};

const updateEmployeeQuestionaire = async(action, employeeList, rolesList) => {
    return inquirer.prompt(updateEmployeeQuestions(action, employeeList, rolesList))
}

const employeesByManagersQuestionaire = async (managerList) => {
    return inquirer.prompt(employeesByManagersQuestion(managerList));
}

const employeesByDepartmentQuestionaire = async (departmentList) => {
    return inquirer.prompt(employeesByDepartmentQuestion(departmentList));
}



const banner = `


dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb
##################################################################################################################################################
                                                                                                                


    8888888888                        888                                          88888888888                       888                       
    888                               888                                              888                           888                       
    888                               888                                              888                           888                       
    8888888    88888b.d88b.  88888b.  888  .d88b.  888  888  .d88b.   .d88b.           888  888d888 8888b.   .d8888b 888  888  .d88b.  888d888 
    888        888 "888 "88b 888 "88b 888 d88""88b 888  888 d8P  Y8b d8P  Y8b          888  888P"      "88b d88P"    888 .88P d8P  Y8b 888P"   
    888        888  888  888 888  888 888 888  888 888  888 88888888 88888888          888  888    .d888888 888      888888K  88888888 888     
    888        888  888  888 888 d88P 888 Y88..88P Y88b 888 Y8b.     Y8b.              888  888    888  888 Y88b.    888 "88b Y8b.     888     
    8888888888 888  888  888 88888P"  888  "Y88P"   "Y88888  "Y8888   "Y8888           888  888    "Y888888  "Y8888P 888  888  "Y8888  888     
                            888                        888                                                                                    
                            888                   Y8b d88P                                                                                    
                            888                    "Y88P"                                                                                     


##################################################################################################################################################
qpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqpqp
`




departmentBanner = `

----------------------------------
         DEPARTMENT TABLE
----------------------------------           
`

roleBanner = `

------------------------------------------------------------------------------------------
                                    ROLE TABLE
------------------------------------------------------------------------------------------            
`

employeeBanner = `

--------------------------------------------------------------------------------------------------
                                         EMPLOYEE TABLE
--------------------------------------------------------------------------------------------------            
`

module.exports = {
    banner,
    firstQuestionaire,
    addRoleQuestionaire,
    addEmployeeQuestionaire,
    continueQuestionaire,
    updateEmployeeQuestionaire,
    employeesByManagersQuestionaire,
    employeesByDepartmentQuestionaire,
    departmentBanner,
    roleBanner,
    employeeBanner

}
const queries =  require('../db/queries')
const questionsData = require('../script/questions');
const cTable = require('console.table');



const queryManager = async() => {

    const initialAnswers = await questionsData.firstQuestionaire();

    initialAnswers.action == 'View Table Contents' ? await viewTables(initialAnswers)
        : initialAnswers.action == 'Add Info' ? await addInfo(initialAnswers)
        : initialAnswers.action == 'Update Employee Info' ? await updateEmployeeInfo(initialAnswers)
        : await queryInfo(initialAnswers);

        await queryManager();

}


// Function for viewing tables content.
const viewTables = async (firstAnswers) => {
    const tableName = firstAnswers.view.toLowerCase();
    await showTable(tableName);
}



// Functions in charge of adding info to tables

const addInfo = async (firstAnswers) => {

    // FUnction in charge of adding a New Department
    if (firstAnswers.add == 'Department') {
        let queryTable = firstAnswers.add.toLowerCase();
        let fieldNames = 'department_name';
        let values = `"${firstAnswers.addDepartment}"`

        await queries.addQuery(queryTable, fieldNames, values)
        await showTable(queryTable);

        console.log(`\nDepartment ${values} succesfully added!!`)
    }

    
    // FUnction in charge of adding a New Role
    if (firstAnswers.add == 'Role') {
        let queryTable = firstAnswers.add.toLowerCase();
        let fieldNames = `title, salary, department_id`;

        let queryDepartments = await queries.getDepartmentList();

        const departmentlist = [];
        queryDepartments.forEach(list => departmentlist.push(list.department_name))

        const addDepartmentInfo = await questionsData.addRoleQuestionaire(departmentlist);

        const departmentId = queryDepartments.filter((x) => x.department_name == addDepartmentInfo.addRoleDepartment)[0].id
        let values = `"${addDepartmentInfo.addRoleName}", "${addDepartmentInfo.addRoleSalary}", ${departmentId}`

        await queries.addQuery(queryTable, fieldNames, values)
        await showTable(queryTable);

        console.log(`\nNew role ${addDepartmentInfo.addRoleName} succesfully added!!`)
    }

    // FUnction in charge of adding a New Employee
    if (firstAnswers.add == 'Employee') {
        let queryTable = firstAnswers.add.toLowerCase();
        let fieldNames = `first_name, last_name, role_id, manager_id, is_manager`;

        let queryRoles = await queries.getRolesList();

        const rolesList = [];
        queryRoles.forEach(list => rolesList.push(list.title))

        const managerList = [];
        let queryManagers = await queries.getManagerList()

        queryManagers.forEach(element => {
            let idtext = element.id.toString().padStart(4,'0');
            let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
            managerList.push(paramtext);
        });
        managerList.push('MNGR  -->  ADD AS MANAGER <--');

        const addEmployeeInfo = await questionsData.addEmployeeQuestionaire(rolesList, managerList);          
        const roleId = queryRoles.filter((x) => x.title == addEmployeeInfo.addRoleEmployee)[0].id

        let managerId = addEmployeeInfo.addManagerEmployee.substring(0,4);
        let isManager = 0;

        if (managerId == "MNGR") {
            managerId = null
            isManager = 1;                
        } else {
            Number(managerId)
        };

        let values = `"${addEmployeeInfo.addFistName}", "${addEmployeeInfo.addSecondName}", ${roleId}, ${managerId}, ${isManager}`

        await queries.addQuery(queryTable, fieldNames, values)
        await showTable(queryTable);

        console.log(`\nNew Employee ${addEmployeeInfo.addFistName} succesfully added!!`)   
    }
}



// Function in charge of updating employee Role and Manager
const updateEmployeeInfo = async (firstAnswers) => {

    let updateAction = firstAnswers.update;

    let employeeList = await queries.getEmployeeList();
    employeeParams = [];
    
    employeeList.forEach(element => {
        let idtext = element.id.toString().padStart(4,'0');
        let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title} - Manager: ${element.manager_id}`
        employeeParams.push(paramtext);                
    });

    const optionList = [];
    let queryRoles;

    if (updateAction == 'Update Role') {
        
        queryRoles = await queries.getRolesList();
        queryRoles.forEach(list => optionList.push(list.title))

    } else {

        let queryManagers = await queries.getManagerList()

        queryManagers.forEach(element => {
            let idtext = element.id.toString().padStart(4,'0');
            let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
            optionList.push(paramtext);                
        });
        optionList.push('MNGR  -->  ADD AS MANAGER <--');

    }

    const updateEmployeeRole = await questionsData.updateEmployeeQuestionaire(updateAction, employeeParams, optionList);

    let idtext = updateEmployeeRole.Employee.substring(0,4);
    idtext = Number(idtext);
    let updateValue;

    if (updateAction == 'Update Role') {
        updateValue = queryRoles.filter((x) => x.title == updateEmployeeRole.updateEmployeeRole)[0].id
        updateValue = `role_id = ` + updateValue;

    } else {
        updateValue = updateEmployeeRole.updateEmployeeManager.substring(0,4);
        updateValue == 'MNGR' ? updateValue = 'manager_id = null, is_manager =1' : updateValue = `manager_id = ${Number(updateValue)}, is_manager = 0`;
    }


    queries.updateEmployee(updateValue, idtext);
    let employeeName = updateEmployeeRole.Employee.split('-')[1]

    console.log(`\nThe role of employee${employeeName}has been updated succesfully!!`)
    await showTable('employee'); 
}

// Functions for cross-info queries
const queryInfo = async (firstAnswers) => {

    let query = firstAnswers.queries;

    if ( query == 'Emplyees by Manager' ) {

        const optionList = [];
        let queryManagers = await queries.getManagerList();

        queryManagers.forEach(element => {
            let idtext = element.id.toString().padStart(4,'0');
            let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
            optionList.push(paramtext);                
        });
        
        employeesManager = await questionsData.employeesByManagersQuestionaire(optionList);
        employeesManager = Number(employeesManager.manager.substring(0,4));

        queryValue = queryManagers.filter((x) => x.id == employeesManager)[0].id;

        managerEmployeesTable = await queries.getManagerEmployees(queryValue);

        console.table('\n\n', managerEmployeesTable)

    } else if (query == 'Employees by Department') {

        let queryDepartments = await queries.getDepartmentList();

        const departmentlist = [];
        queryDepartments.forEach(list => departmentlist.push(list.department_name))
        const addDepartmentInfo = await questionsData.employeesByDepartmentQuestionaire(departmentlist);

        const departmentId = queryDepartments.filter((x) => x.department_name == addDepartmentInfo.department)[0].id

        const departmentEmployeeTable = await queries.employeeDepartmentQuery(departmentId);
        console.table('\n\n', departmentEmployeeTable)

    } else {
        const departmentBudget = await queries.departmentBudgetQuery();
        console.table('\n\n', departmentBudget);
    }

}

// Functions to display Data
const showTable = async  (table) => {

    if (table == 'department') {
        queryFields = `*`;
        addedQuery = ``;
        tableBanner = questionsData.departmentBanner;
    } else if (table == 'role') {
        queryFields = `role.id, role.title, FORMAT(role.salary, 'N2', 'en-us') AS Salary, role.department_id, department.department_name`;
        addedQuery = ` JOIN department ON role.department_id = department.id ORDER BY role.id ASC`;
        tableBanner = questionsData.roleBanner;
    } else if (table == 'employee') {
        queryFields = `employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, employee.manager_id`;
        addedQuery = ` JOIN role ON employee.role_id = role.id ORDER BY employee.id ASC`;
        tableBanner = questionsData.employeeBanner;
    }

     
    let results = await queries.viewTableQuery(queryFields, table, addedQuery)


    console.log('\n', tableBanner);
    console.table(results);
}

module.exports = {
    viewTables, 
    addInfo, 
    updateEmployeeInfo, 
    queryInfo,
    queryManager
}
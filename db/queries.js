const mysql = require('mysql2');
// const questionsData = require('../script/questions');
// const cTable = require('console.table');
require('dotenv').config();

// const { viewTables, addInfo, updateEmployeeInfo, queryInfo } = require('../script/queryFunctions')

// Connect to database
const db = mysql.createConnection(
    
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  );


const functionManager = async () => {

    // const firstAnswers = await questionsData.firstQuestionaire();

/*

    if (firstAnswers.action == 'View Table Contents' ) {
        const tableName = firstAnswers.view.toLowerCase();
        await showTable(tableName);
    }

    if (firstAnswers.action == 'Add Info') {

        if (firstAnswers.add == 'Department') {
            let queryTable = firstAnswers.add.toLowerCase();
            let fieldNames = 'department_name';
            let values = `"${firstAnswers.addDepartment}"`

            await addQuery(queryTable, fieldNames, values)
            await showTable(queryTable);

            console.log(`\nDepartment ${values} succesfully added!!`)
        }

        if (firstAnswers.add == 'Role') {
            let queryTable = firstAnswers.add.toLowerCase();
            let fieldNames = `title, salary, department_id`;

            let queryDepartments = await getDepartmentList();

            const departmentlist = [];
            queryDepartments.forEach(list => departmentlist.push(list.department_name))

            const addDepartmentInfo = await questionsData.addRoleQuestionaire(departmentlist);

            const departmentId = queryDepartments.filter((x) => x.department_name == addDepartmentInfo.addRoleDepartment)[0].id
            let values = `"${addDepartmentInfo.addRoleName}", "${addDepartmentInfo.addRoleSalary}", ${departmentId}`

            await addQuery(queryTable, fieldNames, values)
            await showTable(queryTable);

            console.log(`\nNew role ${addDepartmentInfo.addRoleName} succesfully added!!`)
        }

        if (firstAnswers.add == 'Employee') {
            let queryTable = firstAnswers.add.toLowerCase();
            let fieldNames = `first_name, last_name, role_id, manager_id, is_manager`;

            let queryRoles = await getRolesList();

            const rolesList = [];
            queryRoles.forEach(list => rolesList.push(list.title))

            const managerList = [];
            let queryManagers = await getManagerList()

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

            console.log('queryTable, fieldNames, values --',queryTable, '--' ,fieldNames, '--', values)

            await addQuery(queryTable, fieldNames, values)
            await showTable(queryTable);

            console.log(`\nNew Employee ${addEmployeeInfo.addFistName} succesfully added!!`)   
        }
    }

    if (firstAnswers.action == 'Update Employee Info') {

        let updateAction = firstAnswers.update;

        let employeeList = await getEmployeeList();
        employeeParams = [];
        
        employeeList.forEach(element => {
            let idtext = element.id.toString().padStart(4,'0');
            let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title} - Manager: ${element.manager_id}`
            employeeParams.push(paramtext);                
        });

        const optionList = [];
        let queryRoles;

        if (updateAction == 'Update Role') {
            
            queryRoles = await getRolesList();
            queryRoles.forEach(list => optionList.push(list.title))

        } else {

            let queryManagers = await getManagerList()

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


        updateEmployee(updateValue, idtext);
        let employeeName = updateEmployeeRole.Employee.split('-')[1]

        console.log(`\nThe role of employee${employeeName}has been updated succesfully!!`)
        await showTable('employee'); 

    }

    if (firstAnswers.action == 'Query Info') {

        let query = firstAnswers.queries;

        if ( query == 'Emplyees by Manager' ) {

            const optionList = [];
            let queryManagers = await getManagerList()

            queryManagers.forEach(element => {
                let idtext = element.id.toString().padStart(4,'0');
                let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
                optionList.push(paramtext);                
            });
            
            employeesManager = await questionsData.employeesByManagersQuestionaire(optionList);
            employeesManager = Number(employeesManager.manager.substring(0,4));

            queryValue = queryManagers.filter((x) => x.id == employeesManager)[0].id;

            managerEmployeesTable = await getManagerEmployees(queryValue);

            console.table('\n\n', managerEmployeesTable)

        } else if (query == 'Employees by Department') {

            let queryDepartments = await getDepartmentList();

            const departmentlist = [];
            queryDepartments.forEach(list => departmentlist.push(list.department_name))
            const addDepartmentInfo = await questionsData.employeesByDepartmentQuestionaire(departmentlist);

            const departmentId = queryDepartments.filter((x) => x.department_name == addDepartmentInfo.department)[0].id

            const departmentEmployeeTable = await employeeDepartmentQuery(departmentId);
            console.table('\n\n', departmentEmployeeTable)

        } else {
            const departmentBudget = await departmentBudgetQuery();
            console.table('\n\n', departmentBudget);
        }

    }
*/

    await functionManager();
}


// --------- QUERIES-----------

const addQuery = async (table, fields, values) => {
    let addedRecord = await db.promise().query(`INSERT INTO ${table} (${fields}) VALUES (${values});`)
}

const viewTableQuery = async(queryFields, table, addedQuery) => {
    viewTableResults = await db.promise().query(`SELECT ${queryFields} FROM ${table}${addedQuery}`)
    console.log('22222',queryFields, table, addedQuery )
    return viewTableResults = viewTableResults[0]
}


const getDepartmentList = async () => {
    let departmentList = await db.promise().query(`SELECT * FROM department`);
    return departmentList = departmentList[0];
}

const getRolesList = async () => {
    let rolesList = await db.promise().query(`SELECT * FROM role`);
    return rolesList = rolesList[0];
}

const getEmployeeList = async () => {
    let employeeList = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id ORDER BY employee.id ASC`);
    // let employeeList = await db.promise().query(`SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.manager_id, t2.first_name FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.i JOIN role ON t1.role_id = role.id ORDER BY t1.id ASC`);
    return employeeList = employeeList[0];
}

const getManagerList = async () => {
    // let managerList = await db.promise().query(`SELECT t1.manager_id, t2.first_name, t2.last_name, role.title FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id JOIN role ON t2.role_id = role.id GROUP BY t1.manager_id`);
    let managerList = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE employee.is_manager = 1`);
    return managerList = managerList[0];
}

const updateEmployee = async (updateValue, idtext) => {
    let employeeInfo = await db.promise().query(`UPDATE employee SET ${updateValue} WHERE id = ${idtext}`);
    return employeeInfo = employeeInfo[0];
}

const getManagerEmployees = async (managerId) => {
    let managerEmployees = await db.promise().query(`SELECT t1.id, t1.first_name, t1.last_name, role.title, t1.manager_id, t2.first_name as Manager_Name FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id WHERE t1.manager_id = ${managerId}`);
    return managerEmployees = managerEmployees[0];
}

const employeeDepartmentQuery = async (departmentId) => {
    let employeeByDepartment = await db.promise().query(`SELECT department.id AS Dept_ID, department.department_name, employee.id , employee.first_name , employee.last_name, role.title, FORMAT(role.salary, 'N2', 'en-us') AS Salary FROM employee 
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON  department_id = department.id
    WHERE department.id = ${departmentId}`);
    return employeeByDepartment = employeeByDepartment[0];
}

const departmentBudgetQuery = async () => {
    let departmentBudget = await db.promise().query(`SELECT department.id AS Dept_ID, department.department_name, FORMAT(SUM(role.salary), 'N2', 'en-us') AS Total_Budget
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON  department_id = department.id
    GROUP BY department.id`);
    return departmentBudget = departmentBudget[0];
}


// --------- Populate Tables-----------


module.exports = {
    functionManager,

    addQuery,
    getDepartmentList,
    getRolesList,
    getEmployeeList,
    getManagerList,
    updateEmployee,
    getManagerEmployees,
    employeeDepartmentQuery,
    departmentBudgetQuery,
    viewTableQuery

}

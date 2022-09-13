const mysql = require('mysql2');
const questionsData = require('../script/questions');
const cTable = require('console.table');


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'FGAbBb#22',
      database: 'employee_tracker'
    },
  );


const funtionManager = async () => {

    const firstAnswers = await questionsData.firstQuestionaire();

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
            let fieldNames = `first_name, last_name, role_id, manager_id`;

            let queryRoles = await getRolesList();

            const rolesList = [];
            queryRoles.forEach(list => rolesList.push(list.title))

            const managerList = [];
            let queryManagers = await getManagerList()

            queryManagers.forEach(element => {
                let idtext = element.manager_id.toString().padStart(4,'0');
                let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
                managerList.push(paramtext);
            });
            managerList.push('NULL -  N/A');

            const addEmployeeInfo = await questionsData.addEmployeeQuestionaire(rolesList, managerList);
            
            const roleId = queryRoles.filter((x) => x.title == addEmployeeInfo.addRoleEmployee)[0].id

            let managerId = addEmployeeInfo.addManagerEmployee.substring(0,4);
            managerId == "NULL " ? managerId = null : Number(managerId);

            let values = `"${addEmployeeInfo.addFistName}", "${addEmployeeInfo.addSecondName}", ${roleId}, ${managerId}`

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
                let idtext = element.manager_id.toString().padStart(4,'0');
                let paramtext = `${idtext} -  ${element.first_name} ${element.last_name} - ${element.title}`
                optionList.push(paramtext);                
            });
            optionList.push('NULL -  N/A');

        }

        const updateEmployeeRole = await questionsData.updateEmployeeQuestionaire(updateAction, employeeParams, optionList);

        let idtext = updateEmployeeRole.Employee.substring(0,4);
        idtext = Number(idtext);
        let updateValue;
        let updateField = 'role_id'

        if (updateAction == 'Update Role') {
            updateValue = queryRoles.filter((x) => x.title == updateEmployeeRole.updateEmployeeRole)[0].id
        } else {
            updateValue = updateEmployeeRole.updateEmployeeManager.substring(0,4);
            updateValue == 'NULL ' ? updateValue = null : Number(updateValue);
            updateField = 'manager_id'
        }

        console.log("updateField, updateValue, idtext",updateField, updateValue, idtext)

        updateEmployee(updateField, updateValue, idtext);
        let employeeName = updateEmployeeRole.Employee.split('-')[1]

        console.log(`\nThe role of employee${employeeName}has been updated succesfully added!!`)
        await showTable('employee'); 

    }

    await funtionManager();
}











// --------- QUERIES-----------

const addQuery = async (table, fields, values) => {
    let addedRecord = await db.promise().query(`INSERT INTO ${table} (${fields}) VALUES (${values});`)
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
    let managerList = await db.promise().query(`SELECT t1.manager_id, t2.first_name, t2.last_name, role.title FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id JOIN role ON t2.role_id = role.id GROUP BY t1.manager_id`);
    return managerList = managerList[0];
}

const updateEmployee = async (updateField, updateValue, idtext) => {
    let employeeInfo = await db.promise().query(`UPDATE employee SET ${updateField} = ${updateValue} WHERE id = ${idtext}`);
    return employeeInfo = employeeInfo[0];
}



// --------- Populate Tables-----------

const showTable = async  (table) => {

    // const dep_titles = [
    //     { key: 'id', text: 'ID', len: 3 },
    //     { key: 'department_name', text: 'Department', len: 25 },
    // ];

    // const role_titles = [
    //     { key: 'id', text: 'ID', len: 3 },
    //     { key: 'title', text: 'Title', len: 30 },
    //     { key: 'salary', text: 'Salary', len: 10 },
    //     { key: 'department_id', text: 'Dep ID', len: 6 },
    //     { key: 'department_name', text: 'Department', len: 25 },
    // ];

    // const employee_titles = [
    //     { key: 'id', text: 'ID', len: 3 },
    //     { key: 'first_name', text: 'First Name', len: 15 },
    //     { key: 'last_name', text: 'Last Name', len: 15 },
    //     { key: 'role_id', text: 'Role ID', len: 7 },
    //     { key: 'title', text: 'Title', len: 30 },
    //     { key: 'manager_id', text: 'Manager ID', len: 10 },
    // ];



    if (table == 'department') {
        // t_head = dep_titles;
        queryFields = `*`;
        addedQuery = ``;
        tableBanner = questionsData.departmentBanner;
    } else if (table == 'role') {
        // t_head = role_titles;
        queryFields = `role.id, role.title, role.salary, role.department_id, department.department_name`;
        addedQuery = ` JOIN department ON role.department_id = department.id ORDER BY role.id ASC`;
        tableBanner = questionsData.roleBanner;
    } else if (table == 'employee') {
        // t_head = employee_titles;
        queryFields = `employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, employee.manager_id`;
        addedQuery = ` JOIN role ON employee.role_id = role.id ORDER BY employee.id ASC`;
        tableBanner = questionsData.employeeBanner;
    }


    let results;

    results = await db.promise().query(`SELECT ${queryFields} FROM ${table}${addedQuery}`)
    // table != 'employee' ? results = await db.promise().query(`SELECT ${queryFields} FROM ${table}${addedQuery}`)
    //     : results = await db.promise().query(`SELECT t1.id AS empId, t1.first_name AS firstName, t1.last_name as lastName, role.title as role, t1.manager_id as manId, t2.first_name as managerName
    //     FROM employee t1 
    //     JOIN employee t2 ON t1.manager_id = t2.id 
    //     JOIN role ON t1.role_id = role.id
    //     ORDER BY t1.id ASC`)
    
    results = results[0];


    // console.log('dewdewdedewdew', results)


    // PRINTING SCRIPT

    
    // title_text = ``;
    // title_border = ``;

    // t_head.forEach(title => {
    //     title_text += title.text.toString().padEnd(title.len, ' ') + ' | ';
    //     title_border += ' -'.padEnd(title.len + 1, '-') + '  ';
    // });

    console.log('\n', tableBanner);
    console.table(results);


    // console.log('\n', title_text)
    // console.log(title_border);
    

    // results.forEach(element => {
    //     table_row = ``;
        
    //     t_head.forEach(title => {
            
    //         element[title.key] == null ?  celltext = 'null' : celltext = element[title.key]

    //         table_row += celltext.toString().padEnd(title.len, ' ') + ' | ';
    //     });

    //     console.log('\033[0m',table_row)
    // });
    

}



module.exports = {
    funtionManager,

}

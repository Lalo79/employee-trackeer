const mysql = require('mysql2');
require('dotenv').config();


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  );

// --------- QUERIES-----------

const addQuery = async (table, fields, values) => {
    let addedRecord = await db.promise().query(`INSERT INTO ${table} (${fields}) VALUES (${values});`)
}

const viewTableQuery = async(queryFields, table, addedQuery) => {
    viewTableResults = await db.promise().query(`SELECT ${queryFields} FROM ${table}${addedQuery}`)
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
    return employeeList = employeeList[0];
}

const getManagerList = async () => {
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


module.exports = {
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

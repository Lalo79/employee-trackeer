INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("Human Resources"),
        ("Software Development"),
        ("Finance"),
        ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES  ("Finance Manager", 14543.32, 4),
        ("Legal Counsel", 15873.22, 5),
        ("Human Resources Manager", 10018.89, 2),
        ("Data Coordiator", 11725.48, 3),
        ("Sales Manager", 15784.32, 1),
        ("Sales Representative", 9708.58, 1),
        ("Software & Development Manager", 16123.65, 3),
        ("Internal Auditor", 10167.11, 5),
        ("Financial Analyst", 10021.54, 4),
        ("Analyst Programmer", 9437.56, 3),
        ("Senior Developer", 13149.11, 3);


INSERT INTO employee (first_name, last_name, is_manager, role_id)
VALUES  ("Ragnar", "Ralston", 0, 10),
        ("Dun", "Yanov", 0, 11),
        ("Xena", "Dearnley", 0, 4),
        ("Fanchon", "Hendrich", 0, 11),
        ("Clyve", "Lowey", 0, 6),
        ("Merry", "Fylan", 1, 2),
        ("Shina", "Aubrey", 1, 7),
        ("Andy", "Echalie", 0, 4),
        ("Rowe", "Rebichon", 0, 6),
        ("Lisabeth", "De Mico", 0, 3),
        ("Ferrel", "Zum Felde", 0, 4),
        ("Gale", "Blaker", 0, 9),
        ("Hersch", "Mumbeson", 1, 1),
        ("Babs", "Caunter", 0, 8),
        ("Petr", "Tarbet", 0, 4),
        ("Ynes", "Gallagher", 1, 5),
        ("Eric", "Waber", 0, 8),
        ("Jere", "Fenemore", 0, 10),
        ("Babita", "Freemantle", 0, 8),
        ("Jemimah", "Nunn", 0, 9),
        ("Dorothee", "Purle", 0, 11),
        ("Louie", "Gisbey", 0, 9),
        ("Marc", "Tweedy", 0, 8),
        ("Ardelle", "Foy", 0, 6),
        ("Elyssa", "Aherne", 0, 10),
        ("Wilhelm", "Polleye", 0, 8),
        ("Jennifer", "Westover", 0, 4),
        ("Elke", "Coorington", 0, 9),
        ("Averill", "Wadforth", 0, 9),
        ("Gaspar", "Haigh", 1, 3);



UPDATE employee SET manager_id = 7 WHERE id = 1;
UPDATE employee SET manager_id = 7 WHERE id = 2;
UPDATE employee SET manager_id = 7 WHERE id = 3;
UPDATE employee SET manager_id = 7 WHERE id = 4;
UPDATE employee SET manager_id = 16 WHERE id = 5;
UPDATE employee SET manager_id = null WHERE id = 6;
UPDATE employee SET manager_id = null WHERE id = 7;
UPDATE employee SET manager_id = 7 WHERE id = 8;
UPDATE employee SET manager_id = 16 WHERE id = 9;
UPDATE employee SET manager_id = 30 WHERE id = 10;
UPDATE employee SET manager_id = 7 WHERE id = 11;
UPDATE employee SET manager_id = 13 WHERE id = 12;
UPDATE employee SET manager_id = null WHERE id = 13;
UPDATE employee SET manager_id = 6 WHERE id = 14;
UPDATE employee SET manager_id = 7 WHERE id = 15;
UPDATE employee SET manager_id = null WHERE id = 16;
UPDATE employee SET manager_id = 6 WHERE id = 17;
UPDATE employee SET manager_id = 7 WHERE id = 18;
UPDATE employee SET manager_id = 6 WHERE id = 19;
UPDATE employee SET manager_id = 13 WHERE id = 20;
UPDATE employee SET manager_id = 7 WHERE id = 21;
UPDATE employee SET manager_id = 13 WHERE id = 22;
UPDATE employee SET manager_id = 6 WHERE id = 23;
UPDATE employee SET manager_id = 16 WHERE id = 24;
UPDATE employee SET manager_id = 7 WHERE id = 25;
UPDATE employee SET manager_id = 6 WHERE id = 26;
UPDATE employee SET manager_id = 7 WHERE id = 27;
UPDATE employee SET manager_id = 13 WHERE id = 28;
UPDATE employee SET manager_id = 13 WHERE id = 29;
UPDATE employee SET manager_id = null WHERE id = 30;







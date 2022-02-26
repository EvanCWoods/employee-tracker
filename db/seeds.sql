USE my_company;

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE employee;
TRUNCATE roles;
TRUNCATE departments;

INSERT INTO departments (department_name)
VALUES  ("Engineering"),
        ("Accounting"),
        ("Consulting");

INSERT INTO roles (department_id, title, salary)
VALUES  (1, "Lead Engineer", 99000.99),
        (1, "Junior Engineer", 70000.50),
        (2, "Head of Acocunting", 12085.97),
        (2, "Accountant Intern", 25000.00),
        (3, "Senior Consultant", 97450.90),
        (3, "Junior Consultant", 65050.87);
        
INSERT INTO employees (role_id, first_name, last_name, manager_id)
VALUES  (1, "Evan", "Woods", NULL),
        (2, "Kevin", "Peng", NULL),
        (3, "Liam", "Okane", 1),
        (4, "Ryan", "Basser", NULL),
        (5, "Trevor", "Inglis", 6),
        (6, "Luka", "Tran", NULL);

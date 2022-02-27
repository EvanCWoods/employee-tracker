USE my_company;

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE employees;
TRUNCATE roles;
TRUNCATE departments;

INSERT INTO departments (name)
VALUE ("Sales"),
 ("Engineering"),
 ("Finance"),
 ("Legal");

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 145000, 2),
 ("Legal Team Lead", 189000, 4),
 ("Accountant", 100000, 3),
 ("Sales Lead", 100000, 1),
 ("Salesperson", 80000, 1),
 ("Software Engineer", 120000, 2),
 ("Lawyer", 190000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Evan", "Woods", null, 1),
("Kevin", "Peng", null, 2),
("Liam","OKane",null,3),
("Ryan", "Basser", 1, 4),
("Luka", "Tran", 4, 5),
("Brianca", "Inglis", 1, 6),
("Joe", "Stevenson", 2, 7);
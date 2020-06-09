USE employeetracker_db;
-- inserting departments
INSERT INTO department (name)
VALUES ('Sales'), ('Legal'), ('Finance'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 4), ('Sales Lead', 100000, 1), ('Salesperson', 80000, 1), ('Software Engineer', 120000, 4), ('Lawyer', 190000, 2), ('Accountant', 125000, 3), ('Legal Team Lead', 250000, 2), ('Financial Analyst', 95000, 3);
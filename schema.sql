DROP DATABASE IF EXISTS employeetracker_db;

CREATE DATABASE employeetracker_db;

USE employeetracker_db;

  CREATE TABLE department (
id INT(10) AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
 PRIMARY KEY (id)
 ) ;

  CREATE TABLE role (
  id INT (10) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT(10) NOT NULL,
  PRIMARY KEY (id)
  );
    CREATE TABLE employee (
  id INT(10) AUTO_INCREMENT NOT NULL, 
  first_name VARCHAR(30) NOT NULL,
  last_name  VARCHAR(30) NOT NULL,
  role_id INT (10) NOT NULL,
  manager_id INT (10),
	PRIMARY KEY (id)
);
--  INSERTS FOR DEPARTMENT TABLE
INSERT INTO department (id, name)
VALUES (1, "Juan");
INSERT INTO department (id, name)
VALUES (2, "MP");
INSERT INTO department (id, name)
VALUES (3, "William");
INSERT INTO department (id, name)
VALUES (4, "Rafael");
INSERT INTO department (id, name)
VALUES (5, "Liz");
-- INSERTED VALUE IN ROLE TABLE
INSERT INTO role (id, title, salary, department_id )
VALUES (1, " manager",50000.00, 1);
INSERT INTO role (id, title, salary, department_id )
VALUES (2, " employee", 40000.00, 2);
INSERT INTO role (id, title, salary, department_id )
VALUES (3, " inturn",30000.00, 3);
INSERT INTO role (id, title, salary, department_id )
VALUES (4, " engineer",20000.00, 4);
INSERT INTO role (id, title, salary, department_id )
VALUES (5, " student",10000.00, 5);
-- INSERTED VALUE IN EMPLOYEE TABLE
INSERT INTO employee (id, first_name, last_name,
  role_id,  manager_id)
VALUES (1,"Juan", "Santoyo", 1, 1);
INSERT INTO employee (id, first_name, last_name,
  role_id,  manager_id)
VALUES (2,"MP", "Santoyo", 2, 2);INSERT INTO employee (id, first_name, last_name,
  role_id,  manager_id)
VALUES (3,"Wiliam", "Navas", 3, 3);INSERT INTO employee (id, first_name, last_name,
  role_id,  manager_id)
VALUES (4,"Rafael", "Hurtado", 4, 4);INSERT INTO employee (id, first_name, last_name,
  role_id,  manager_id)
VALUES (5,"Liz", "Hurtado", 5, 5);

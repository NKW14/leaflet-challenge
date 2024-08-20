
-- Created Data Base mannually 

-- Creating Tables on SQL


CREATE TABLE departments (
    dept_no VARCHAR NOT NULL,
    dept_name VARCHAR NOT NULL,
    PRIMARY KEY(dept_no)
);

CREATE TABLE dept_emp (
    emp_no INTEGER NOT NULL,
    dept_no VARCHAR NOT NULL,
    PRIMARY KEY(emp_no),
    FOREIGN KEY(dept_no) REFERENCES departments (dept_no)

);


CREATE TABLE dept_manager( 
    manager_id serial NOT NULL,
    dept_no VARCHAR NOT NULL,
    emp_no INTEGER NOT NULL,
    PRIMARY KEY (manager_id),
    FOREIGN KEY (dept_no) REFERENCES departments (dept_no),
    FOREIGN KEY (emp_no) REFERENCES dept_emp (emp_no)
);

CREATE TABLE employees (
    emp_no INTEGER NOT NULL,
    emp_title_id VARCHAR NOT NULL,
    birth_date DATE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    sex VARCHAR NOT NULL,
    hire_date DATE NOT NULL,
    PRIMARY KEY (emp_title_id),
    FOREIGN KEY (emp_no) REFERENCES dept_emp (emp_no)
);

CREATE TABLE salaries (
    emp_no INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    PRIMARY KEY (salary),
    FOREIGN KEY (emp_no) REFERENCES dept_emp (emp_no)
);


CREATE TABLE titles (
    title_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    PRIMARY KEY (title),
    FOREIGN KEY (title_id) REFERENCES employees (emp_title_id) 
);



-- Inserted Data manually 

-- Data Analysis 1
SELECT DISTINCT salaries.salary, employees.emp_no, employees.last_name, employees.first_name, employees.sex
FROM employees
INNER JOIN salaries ON employees.emp_no = salaries.emp_no;


--Data Analysis 2
SELECT first_name, last_name, hire_date
FROM employees
WHERE EXTRACT(YEAR FROM hire_date)= 1986;

--Data Analysis 3 

SELECT dept_manager.dept_no, dept_manager.emp_no, employees.first_name, employees.last_name, departments.dept_name
FROM employees
INNER JOIN dept_manager ON dept_manager.emp_no = employees.emp_no
INNER JOIN departments ON dept_manager.dept_no = departments.dept_no;

--Data Analysis 4
SELECT dept_emp.dept_no, employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
FROM employees
INNER JOIN dept_emp ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments ON dept_emp.dept_no = departments.dept_no;



--Data Analysis 5 
SELECT employees.first_name, employees.last_name, employees.sex
FROM employees
WHERE first_name = 'Hercules' 
AND last_name LIKE 'B%';

--Data Analysis 6
SELECT emp_no, last_name, first_name 
FROM employees
WHERE emp_no IN
   (SELECT emp_no
    FROM departments
    WHERE dept_name = 'Sales'
    );

--Data Analysis 7
SELECT employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
FROM employees
INNER JOIN dept_emp ON employees.emp_no = dept_emp.emp_no
INNER JOIN departments ON departments.dept_no = dept_emp.dept_no
WHERE dept_name = 'Sales' OR dept_name = 'Development';

--Data Analysis 8 
SELECT last_name, COUNT(first_name)
FROM employees
GROUP BY last_name;




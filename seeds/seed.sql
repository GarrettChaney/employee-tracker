-- department seeds --
insert into department (department_name)
values ('Sales'), ('Development'), ('Finance'), ('Legal');


-- role seeds -- 
insert into role (title, salary, department_id)
select 'Sales Manager', 100000, id from department where department_name = 'Sales';
insert into role (title, salary, department_id)
select 'Salesperson', 80000, id from department where department_name = 'Sales';
insert into role (title, salary, department_id)
select 'Senior Developer', 140000, id from department where department_name = 'Development';
insert into role (title, salary, department_id)
select 'Junior Developer', 80000, id from department where department_name = 'Development';
insert into role (title, salary, department_id)
select 'Payroll Specialist', 110000, id from department where department_name = 'Finance';
insert into role (title, salary, department_id)
select 'Attorney', 180000, id from department where department_name = 'Legal';
insert into role (title, salary, department_id)
select 'Legal Aide', 80000, id from department where department_name = 'Legal';


-- employee seeds --
insert into employee (first_name, last_name, role_id, manager_id)
values 
  ('John', 'Doe', 1, null),
  ('Jane', 'Doe', 2, 1),
  ('Bob', 'Smith', 3, null),
  ('Alice', 'Johnson', 4, 3),
  ('Mike', 'Williams', 5, null),
  ('Emily', 'Taylor', 6, null),
  ('David', 'Clark', 7, 6),
  ('Olivia', 'Moore', 2, 1);

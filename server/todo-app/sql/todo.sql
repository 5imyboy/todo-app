drop database if exists todo;
create database todo;
use todo;

drop table if exists task;

create table task (
	task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title varchar(100) not null unique,
    `description` varchar(1024),
	`status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
    hours int not null default(0),
    minutes int not null default(0)
);

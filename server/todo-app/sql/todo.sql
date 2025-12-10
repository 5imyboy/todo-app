drop database if exists todo;
create database todo;
use todo;

drop table if exists task;
drop table if exists `user`;

create table task (
	task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title varchar(100) not null unique,
    `description` varchar(1024),
	`status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
    hours int not null default(0),
    minutes int not null default(0)
);

create table `user` (
	user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email varchar(1024) not null unique
);

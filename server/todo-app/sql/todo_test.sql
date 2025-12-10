drop database if exists todo_test;
create database todo_test;
use todo_test;

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
    email varchar(256) not null unique
);

delimiter //
create procedure set_good_known_state()
begin
    -- Resets the auto_increment value.
	truncate table task;
    truncate table `user`;
    
    insert into task
    values
		(1, 1, "Clean Room", "Make the bed and vacumm the floor", 'NOT_STARTED', 2, 0),
		(2, 1, "Brush Teeth", "Brush for at least 3 minutes!", 'IN_PROGRESS', 0, 10),
		(3, 2, "Wake Up", "", 'COMPLETED', 0, 5);
        
	insert into `user`
    values 
		(1, "testOne@email.com"),
        (2, "testTwo@email.com");
end //
delimiter ;
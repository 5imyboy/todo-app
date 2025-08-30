drop database if exists todo_test;
create database todo_test;
use todo_test;

drop table if exists task;

create table task (
	task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title varchar(100) not null unique,
    `description` varchar(1024),
	`status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
    hours int not null default(0),
    minutes int not null default(0)
);

delimiter //
create procedure set_good_known_state()
begin
    -- Resets the auto_increment value.
	truncate table todo;
    
    insert into todo
    values
		(1, "Clean Room", "Make the bed and vaccum the floor", 'NOT_STARTED', 2, 0),
		(2, "Brush Teeth", "Brush for at least 3 minutes!", 'IN_PROGRESS', 0, 10),
		(3, "Wake Up", "", 'COMPLETED', 0, 5);
end //
delimiter ;

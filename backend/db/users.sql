CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `sub` VARCHAR(255) NOT NULL,
    `exercise_id` INT NOT NULL,
    `creation_time` INT NOT NULL,
    `academic_id` INT NOT NULL,
    `note` INT DEFAULT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_users_sub` (`sub`),
    KEY `idx_users_academic_id` (`academic_id`),
    KEY `idx_users_exercise_id` (`exercise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

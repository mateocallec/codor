CREATE TABLE `exercises` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `sub` VARCHAR(255) NOT NULL,
    `creation_time` INT NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_exercises_sub` (`sub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

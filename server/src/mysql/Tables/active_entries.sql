DROP TABLE `active_entries`;
CREATE TABLE `active_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `amount` decimal(14,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `categoryId_idx` (`categoryId`),
  CONSTRAINT `categoryId` FOREIGN KEY (`categoryId`) REFERENCES `active_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

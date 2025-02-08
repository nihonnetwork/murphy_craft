CREATE TABLE IF NOT EXISTS `murphy_craft` (
  `id` varchar(200),
  `worktime` int(11),
  `materials` int(11),
  `upgrade` varchar(2000) DEFAULT '{}',
  `fuel` varchar(200),
  `outcome` varchar(2000) DEFAULT '{}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
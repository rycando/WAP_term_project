-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: campusbook
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `publishedAt` varchar(255) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `mainImage` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'ON',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `sellerId` int DEFAULT NULL,
  `listPrice` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f875df3f534d24cc795eb01361f` (`sellerId`),
  CONSTRAINT `FK_f875df3f534d24cc795eb01361f` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',10000,'A','ㄷㅈㄹㄷㄹㄹㄷ',NULL,'ON','2025-11-30 07:56:19.876336','2025-11-30 11:19:31.000000',1,NULL),(2,'9788970509716','C언어로 쉽게 풀어쓴 자료구조 (개정 3판)','천인국^공용해^허상호','생능출판','20190222',10000,'A','ㅇㅇㅁㄴㅇㅁㄴ',NULL,'SOLD','2025-11-30 08:19:16.416677','2025-11-30 08:28:46.000000',1,NULL),(3,'9788970509716','C언어로 쉽게 풀어쓴 자료구조 (개정 3판)','천인국^공용해^허상호','생능출판','20190222',10000,'A','','/app/uploads/1764503614520-ì¤í¬ë¦°ì· 2023-12-18 175946.png','DELETED','2025-11-30 11:53:34.534501','2025-11-30 15:35:23.000000',4,NULL),(4,'9791156640103','쉽게 배우는 알고리즘 (관계 중심의 사고법)','문병로','한빛아카데미','20240103',20000,'A','',NULL,'DELETED','2025-11-30 11:55:11.620315','2025-11-30 15:35:39.000000',4,NULL),(5,'9791156640103','쉽게 배우는 알고리즘 (관계 중심의 사고법)','문병로','한빛아카데미','20240103',20000,'A','','/app/uploads/1764503721691-9791156640103.jpg','DELETED','2025-11-30 11:55:21.700662','2025-11-30 15:35:47.000000',4,NULL),(6,'9788970509716','','','','',0,'A','','/app/uploads/1764505183828-9791156640103.jpg','DELETED','2025-11-30 12:19:43.838391','2025-11-30 15:35:54.000000',4,NULL),(7,'','','','','',0,'A','','uploads/1764508795052-9791156640103.jpg','DELETED','2025-11-30 13:19:55.069086','2025-11-30 15:36:01.000000',4,NULL),(8,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',0,'A','','uploads/1764512982212-9791156640103.jpg','SOLD','2025-11-30 14:29:42.229936','2025-11-30 15:24:45.000000',5,NULL),(9,'9791156640103','쉽게 배우는 알고리즘 (관계 중심의 사고법)','문병로','한빛아카데미','20240103',19136,'A','','uploads/1764514539012-9791156640103.jpg','DELETED','2025-11-30 14:55:39.029392','2025-11-30 15:36:45.000000',5,29440),(10,'9788970509716','C언어로 쉽게 풀어쓴 자료구조 (개정 3판)','천인국^공용해^허상호','생능출판','20190222',16965,'A','.','uploads/1764514812510-9791185475578.jpg','DELETED','2025-11-30 15:00:12.530162','2025-11-30 15:36:39.000000',5,26100),(11,'9788996094043','윤성우의 열혈 C++ 프로그래밍 (개정판)','윤성우','오렌지미디어','20100514',15000,'A','','uploads/1764515534315-9788996094043.jpg','DELETED','2025-11-30 15:12:14.326139','2025-11-30 15:36:34.000000',5,24300),(12,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',24000,'A','.','uploads/1764516635630-9791185475578.jpg','DELETED','2025-11-30 15:30:35.664422','2025-11-30 15:31:06.000000',5,37050),(13,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',24000,'A','.','uploads/1764517042608-9791185475578.jpg','SOLD','2025-11-30 15:37:22.622755','2025-11-30 15:39:15.000000',5,37050),(14,'9788996094050','윤성우의 열혈 C 프로그래밍 (개정판)','윤성우','오렌지미디어','20101101',14000,'A','.','uploads/1764517135005-9788996094043.jpg','ON','2025-11-30 15:38:55.019743','2025-11-30 15:38:55.000000',5,22500),(15,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','.',NULL,'DELETED','2025-11-30 16:15:19.578780','2025-11-30 16:15:27.000000',5,31280),(16,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','.','uploads/1764519357869-9791192932675.jpg','ON','2025-11-30 16:15:57.876331','2025-11-30 16:15:57.000000',5,31280),(17,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',24000,'A','.','uploads/1764520622686-9791185475578.jpg','ON','2025-11-30 16:37:02.694518','2025-11-30 16:37:02.000000',5,37050),(18,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',19000,'B','.','uploads/1764520665760-9791185475578.jpg','ON','2025-11-30 16:37:45.772957','2025-11-30 16:37:45.000000',5,37050),(19,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','.','uploads/1764520779192-KakaoTalk_20251201_013734773_02.jpg','ON','2025-11-30 16:39:39.243712','2025-11-30 16:39:39.000000',5,31280),(20,'9791185475578','운영체제 (제10판)','Abraham Silberschatz','퍼스트북','20200228',19000,'B','.','uploads/1764602897101-9788996094043.jpg','DELETED','2025-12-01 14:19:43.645162','2025-12-01 16:42:59.000000',4,37050),(21,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','필기가 조금 있어용','uploads/1764605514067-ì±ê²íì§ì¬ì§.jpg','DELETED','2025-12-01 16:11:54.154474','2025-12-01 16:14:45.000000',4,31280),(22,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','필기가 조금 있어용','uploads/1764605851732-ì±ê²íì§ì¬ì§.jpg','SOLD','2025-12-01 16:17:31.805039','2025-12-01 16:40:44.000000',7,31280),(23,'9791192932675','으뜸 파이썬 (개정판)','박동규^강영민','생능출판','20240614',16000,'B','.','uploads/1764606997416-9791192932675.jpg','DELETED','2025-12-01 16:36:37.429350','2025-12-01 16:43:18.000000',7,31280),(24,'9788970509716','C언어로 쉽게 풀어쓴 자료구조 (개정 3판)','천인국^공용해^허상호','생능출판','20190222',9000,'C','.','uploads/1764607501242-XL.jfif','ON','2025-12-01 16:45:01.257798','2025-12-01 16:45:01.000000',7,26100),(25,'9791156646082','데이터 통신과 컴퓨터 네트워크','박기현','한빛아카데미','20220630',22000,'S','.','uploads/1764607743034-B7400451696_l.jpg','ON','2025-12-01 16:49:03.045517','2025-12-01 16:49:03.000000',7,27600);
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_image`
--

DROP TABLE IF EXISTS `book_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `bookId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_764debb683bba6986f25d7369bf` (`bookId`),
  CONSTRAINT `FK_764debb683bba6986f25d7369bf` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_image`
--

LOCK TABLES `book_image` WRITE;
/*!40000 ALTER TABLE `book_image` DISABLE KEYS */;
INSERT INTO `book_image` VALUES (7,'/app/uploads/1764503614520-ì¤í¬ë¦°ì· 2023-12-18 175946.png',3),(8,'/app/uploads/1764503721691-9791156640103.jpg',5),(9,'/app/uploads/1764505183828-9791156640103.jpg',6),(10,'uploads/1764508795052-9791156640103.jpg',7),(11,'uploads/1764512982212-9791156640103.jpg',8),(12,'uploads/1764514539012-9791156640103.jpg',9),(13,'uploads/1764514812510-9791185475578.jpg',10),(14,'uploads/1764515534315-9788996094043.jpg',11),(15,'uploads/1764516635630-9791185475578.jpg',12),(16,'uploads/1764517042608-9791185475578.jpg',13),(17,'uploads/1764517135005-9788996094043.jpg',14),(18,'uploads/1764519357869-9791192932675.jpg',16),(19,'uploads/1764520622686-9791185475578.jpg',17),(20,'uploads/1764520665760-9791185475578.jpg',18),(21,'uploads/1764520779192-KakaoTalk_20251201_013734773_02.jpg',19),(23,'uploads/1764602897101-9788996094043.jpg',20),(24,'uploads/1764605514067-ì±ê²íì§ì¬ì§.jpg',21),(25,'uploads/1764605851732-ì±ê²íì§ì¬ì§.jpg',22),(26,'uploads/1764606997416-9791192932675.jpg',23),(27,'uploads/1764607501242-XL.jfif',24),(28,'uploads/1764607743034-B7400451696_l.jpg',25);
/*!40000 ALTER TABLE `book_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `roomId` int DEFAULT NULL,
  `senderId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_55dfd6d1589749727a7ef2d121f` (`roomId`),
  KEY `FK_a2be22c99b34156574f4e02d0a0` (`senderId`),
  CONSTRAINT `FK_55dfd6d1589749727a7ef2d121f` FOREIGN KEY (`roomId`) REFERENCES `chat_room` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a2be22c99b34156574f4e02d0a0` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES (1,'.','2025-11-30 07:56:50.048354','2025-11-30 07:56:50.048354',1,1),(2,'mmm','2025-11-30 08:28:35.416167','2025-11-30 08:28:35.416167',3,3),(3,'ㄹ','2025-11-30 11:30:41.696802','2025-11-30 11:30:41.696802',5,3),(4,'b','2025-11-30 11:40:27.143067','2025-11-30 11:40:27.143067',6,4),(5,'..','2025-11-30 15:24:25.972590','2025-11-30 15:24:25.972590',8,5),(6,'...','2025-11-30 15:24:39.404592','2025-11-30 15:24:39.404592',8,5),(7,'....','2025-11-30 16:18:53.608559','2025-11-30 16:18:53.608559',13,5),(8,'안녕하세요','2025-11-30 16:42:45.201304','2025-11-30 16:42:45.201304',14,4),(9,'안녕하세요 구매 원합니다!','2025-12-01 16:20:46.816326','2025-12-01 16:20:46.816326',15,4),(10,'네 오늘 12시 정문 괜찮으신가요?','2025-12-01 16:26:25.449694','2025-12-01 16:26:25.449694',15,7),(11,'넹!!','2025-12-01 16:26:54.772939','2025-12-01 16:26:54.772939',15,4);
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL DEFAULT 'OPEN',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `bookId` int DEFAULT NULL,
  `sellerId` int DEFAULT NULL,
  `buyerId` int DEFAULT NULL,
  `appointmentAt` datetime DEFAULT NULL,
  `appointmentPlace` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9b01e4ef6f76d0fb7ea9a94d706` (`bookId`),
  KEY `FK_a4708b9269dbaaa397a52d3f4fe` (`sellerId`),
  KEY `FK_dd32e3f6b2d15d457034d32724e` (`buyerId`),
  CONSTRAINT `FK_9b01e4ef6f76d0fb7ea9a94d706` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`),
  CONSTRAINT `FK_a4708b9269dbaaa397a52d3f4fe` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_dd32e3f6b2d15d457034d32724e` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room`
--

LOCK TABLES `chat_room` WRITE;
/*!40000 ALTER TABLE `chat_room` DISABLE KEYS */;
INSERT INTO `chat_room` VALUES (1,'OPEN','2025-11-30 07:56:39.286600','2025-11-30 08:14:19.000000',1,1,1,NULL,NULL),(2,'OPEN','2025-11-30 08:19:33.209909','2025-11-30 08:19:33.209909',2,1,1,NULL,NULL),(3,'SOLD','2025-11-30 08:28:27.415934','2025-11-30 08:28:46.000000',2,1,3,'2025-11-30 09:00:00',NULL),(4,'OPEN','2025-11-30 11:19:23.960740','2025-11-30 11:19:31.000000',1,1,2,NULL,NULL),(5,'OPEN','2025-11-30 11:27:22.744034','2025-11-30 11:27:22.744034',1,1,3,NULL,NULL),(6,'OPEN','2025-11-30 11:40:14.903733','2025-11-30 11:40:14.903733',1,1,4,NULL,NULL),(7,'SOLD','2025-11-30 12:03:05.000119','2025-11-30 12:03:21.000000',4,4,4,'2025-11-30 12:45:00',NULL),(8,'SOLD','2025-11-30 14:35:34.613096','2025-11-30 15:24:45.000000',8,5,5,'2025-11-30 16:00:00',NULL),(9,'SOLD','2025-11-30 15:25:00.636419','2025-11-30 15:25:04.000000',11,5,5,'2025-11-30 16:00:00',NULL),(10,'SOLD','2025-11-30 15:39:13.143591','2025-11-30 15:39:15.000000',13,5,5,'2025-11-30 16:15:00',NULL),(11,'OPEN','2025-11-30 15:40:18.265397','2025-11-30 15:40:18.265397',14,5,5,NULL,NULL),(12,'OPEN','2025-11-30 15:42:29.886034','2025-11-30 15:42:29.886034',14,5,4,NULL,NULL),(13,'OPEN','2025-11-30 16:18:46.626562','2025-11-30 16:18:46.626562',1,1,5,NULL,NULL),(14,'OPEN','2025-11-30 16:42:34.915618','2025-11-30 16:42:34.915618',19,5,4,NULL,NULL),(15,'SOLD','2025-12-01 16:20:14.825277','2025-12-01 16:40:44.000000',22,7,4,'2025-12-01 17:15:00','정문');
/*!40000 ALTER TABLE `chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyword`
--

DROP TABLE IF EXISTS `keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keyword` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a5072e1cad201e2caf5efa7e8c5` (`userId`),
  CONSTRAINT `FK_a5072e1cad201e2caf5efa7e8c5` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyword`
--

LOCK TABLES `keyword` WRITE;
/*!40000 ALTER TABLE `keyword` DISABLE KEYS */;
INSERT INTO `keyword` VALUES (1,'운영체제','2025-11-30 07:28:32.806754','2025-11-30 07:28:32.806754',1),(3,'운영체제','2025-11-30 15:06:12.717712','2025-11-30 15:06:12.717712',5),(7,'웹응용프로그래밍','2025-12-01 16:34:04.596964','2025-12-01 16:34:04.596964',4),(10,'으뜸 파이썬','2025-12-01 16:39:33.369398','2025-12-01 16:39:33.369398',4);
/*!40000 ALTER TABLE `keyword` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `major` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'123@123.123','$2b$10$Uuvxn2fErMcgMn3oBq14gOOw3ZeaEY4vRKG2kzKjrNFKUtQL2T7S6','123','정컴','2025-11-30 07:22:36.794325','2025-11-30 07:22:36.794325'),(2,'444@444.444','$2b$10$IB7QiFEtho2ztey3A50teeRmmIyG2StZWH.WzyF9NC9//UJHdmfaq','444','정컴','2025-11-30 07:29:10.047548','2025-11-30 07:29:10.047548'),(3,'thdual429@pusan.ac.kr','$2b$10$zUHDOOg/.Uv90eqKdna3LeKLcRc1VH1OmdNTGGgo6Cv2OxS1TLHd2','111','정컴','2025-11-30 07:32:17.336732','2025-11-30 07:32:17.336732'),(4,'buyer@pusan.ac.kr','$2b$10$Djz5v7tIagJk7ROo1zEAduKoPk6TestuOJVLpwD3F016SEttSB9fu','buyer','정컴','2025-11-30 11:39:43.503943','2025-11-30 11:39:43.503943'),(5,'producer@pusan.ac.kr','$2b$10$NR19hiumjvdrFbeRg5Botukm6GpmnbCDHepSt0IH6v4ErKy6VW3ve','producer','정컴','2025-11-30 13:53:42.092841','2025-11-30 13:53:42.092841'),(6,'1','$2b$10$L.OBcTWepxKeHBuXIlXSR.bn5MuWy7IQKHXA3D6BqRXtw17TMkBru','1','1','2025-11-30 15:33:42.080744','2025-11-30 15:33:42.080744'),(7,'seller@pusan.ac.kr','$2b$10$641B9QSXnDHwJYr/DLaX6ugK8t3.TaoEQWo3xFgfVu8Me0lCx7GYW','seller','정컴','2025-12-01 16:15:31.166287','2025-12-01 16:15:31.166287'),(8,'buyer2@pusan.ac.kr','$2b$10$XnBvsOvHe8YfsGPmNBRYreHVFw2ii8KD7jvCHcnZqPV3FsE9i67u6','buyer2','정컴','2025-12-01 16:41:46.695817','2025-12-01 16:41:46.695817');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'campusbook'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02 15:01:21

CREATE DATABASE  IF NOT EXISTS `iqfit_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `iqfit_db`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: iqfit_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_accessed` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `content_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfqns010wvnoepy51qfkhufybf` (`content_id`),
  KEY `FK5bm1lt4f4eevt8lv2517soakd` (`user_id`),
  CONSTRAINT `FK5bm1lt4f4eevt8lv2517soakd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKfqns010wvnoepy51qfkhufybf` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,'2025-12-04 23:17:26.431318','COMPLETED',6,4),(2,'2025-12-04 23:24:30.438353','COMPLETED',7,4),(3,'2025-12-07 22:51:14.627827','COMPLETED',6,9),(4,'2025-12-07 22:55:11.069636','COMPLETED',7,9),(5,'2025-12-07 22:57:48.674099','COMPLETED',9,10),(6,'2025-12-10 05:46:03.922325','COMPLETED',6,3),(7,'2025-12-10 05:46:29.643934','COMPLETED',7,3);
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `access_level` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `description` text,
  `difficulty_level` varchar(255) DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `upload_date` date DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `reps` varchar(255) DEFAULT NULL,
  `rest_time_seconds` int DEFAULT NULL,
  `sets` int DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (6,'FREE','PUSH','WORKOUT','sfdasadfasd','BEGINNER',15,'Triceps Extension','2025-12-04','https://www.youtube.com/watch?v=1u18yJELsh0','12',20,3,NULL),(7,'FREE','CORE','WORKOUT','abs','BEGINNER',15,'Abs Cable Crunch','2025-12-04','https://www.youtube.com/shorts/hph0qDyyk2I','12',60,3,NULL),(8,'PREMIUM','CARDIO','WORKOUT','Cardio','BEGINNER',15,'Burpees','2025-12-04','https://www.youtube.com/shorts/McK6y7t5_XY','12',60,3,NULL),(9,'PREMIUM','PUSH','WORKOUT','Bench Press','INTERMEDIATE',15,'Bench Press','2025-12-04','https://www.youtube.com/shorts/hWbUlkb5Ms4','12',60,3,NULL),(10,'PREMIUM','','WORKOUT','push up','BEGINNER',15,'Push Up','2025-12-04','https://www.youtube.com/shorts/4Bc1tPaYkOo','12',60,3,NULL),(11,'PREMIUM','PULL','WORKOUT','pull ups','BEGINNER',15,'Pull up','2025-12-04','https://www.youtube.com/shorts/ym1V5H35IpA','12',60,3,NULL),(12,'FREE','PUSH','WORKOUT','asdfasd','BEGINNER',15,'gega','2025-12-04','https://www.youtube.com/watch?v=pApjVjn4_cQ&list=RDw-tYngyVXLM&index=3','12',60,3,NULL),(14,'FREE','Breakfast','RECIPE','sadfasdfsadfsadfsad','BEGINNER',15,'balot','2025-12-09','','12',60,3,NULL);
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_sent` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'2025-12-04 10:34:10.699901','test@gmail.com','asdfsadfasdf','test'),(2,'2025-12-04 10:37:13.857366','test@gmail.com','sadfasdfas','test'),(3,'2025-12-04 10:59:15.295413','test@gmail.com','asdfasdf','test'),(4,'2025-12-04 10:59:40.610991','test@gmail.com','dasfsadfas','test'),(5,'2025-12-07 08:33:41.374967','test12@gmail.com','asdfasdf','test');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subscription_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa3xnf2o6mt8cqbewvq2ouq3rq` (`subscription_id`),
  KEY `FKj94hgy9v5fw1munb90tar2eje` (`user_id`),
  CONSTRAINT `FKa3xnf2o6mt8cqbewvq2ouq3rq` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`),
  CONSTRAINT `FKj94hgy9v5fw1munb90tar2eje` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,9.99,'2025-12-01 02:16:28.979178','Credit Card','PAID',1,3),(2,9.99,'2025-12-01 02:24:59.438815','Credit Card','PAID',2,3),(3,9.99,'2025-12-01 02:33:48.209324','Credit Card','PAID',3,2),(4,99.99,'2025-12-04 23:41:43.373450','Credit Card','PAID',4,4),(5,99.99,'2025-12-05 00:46:48.332747','PayPal','PAID',5,4),(6,99.99,'2025-12-07 22:56:39.972676','PayPal','PAID',6,10);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Access to standard workouts',30,'Basic Monthly',9.99),(2,'All access + personal coaching',365,'VIP Annual',99.99);
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_date` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `plan_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb1uf5qnxi6uj95se8ykydntl1` (`plan_id`),
  KEY `FKhro52ohfqfbay9774bev0qinr` (`user_id`),
  CONSTRAINT `FKb1uf5qnxi6uj95se8ykydntl1` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`),
  CONSTRAINT `FKhro52ohfqfbay9774bev0qinr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,'2025-12-31',_binary '','2025-12-01',1,3),(2,'2025-12-31',_binary '','2025-12-01',1,3),(3,'2025-12-31',_binary '','2025-12-01',1,2),(4,'2026-12-05',_binary '','2025-12-05',2,4),(5,'2026-12-05',_binary '','2025-12-05',2,4),(6,'2026-12-08',_binary '','2025-12-08',2,10);
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `is_premium` bit(1) NOT NULL,
  `suspended` bit(1) NOT NULL,
  `bio` text,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'john@example.com','John Doe',NULL,'2025-11-20','password123','CLIENT',_binary '\0',_binary '\0',NULL,NULL,NULL),(2,NULL,'basinillocj5@gmail.com','Christian','','2025-11-27','123456','CLIENT',_binary '',_binary '\0','',NULL,NULL),(3,'2002-03-04','admin@iqfit.com','Admin User','Male','2025-12-01','admin123','ADMIN',_binary '',_binary '\0','',170,80),(4,'2025-12-10','test@gmail.com','test','Male','2025-12-01','123456','CLIENT',_binary '',_binary '\0','',NULL,NULL),(6,'1999-02-02','test1@gmail.com','test1','Male','2025-12-07','123456','CLIENT',_binary '\0',_binary '\0',NULL,NULL,NULL),(8,'2025-12-03','test2@gmail.com','test2','Male','2025-12-07','123456','CLIENT',_binary '\0',_binary '\0',NULL,NULL,NULL),(9,'2025-12-03','test3@gmail.com','test3','Male','2025-12-07','123456','CLIENT',_binary '\0',_binary '\0',NULL,NULL,NULL),(10,'2025-12-03','test4@gmail.com','test4','Male','2025-12-08','123456','CLIENT',_binary '',_binary '\0',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10 13:51:15

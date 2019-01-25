-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2019 at 01:07 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stationary`
--

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `name`, `description`, `createddate`, `createdby`, `companyid`) VALUES
(2, 'brand 21', 'brand 31', '2018-12-31 16:37:35', 2, 1),
(3, 'barnd 3', 'brand 3', '2018-12-31 17:15:29', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `companymaster`
--

CREATE TABLE `companymaster` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `owner` varchar(1000) DEFAULT NULL,
  `address_ln1` varchar(500) DEFAULT NULL,
  `address_ln2` varchar(500) DEFAULT NULL,
  `mobile1` bigint(20) DEFAULT NULL,
  `mobile2` bigint(20) DEFAULT '0',
  `email` varchar(500) DEFAULT NULL,
  `website` varchar(500) DEFAULT ' ',
  `logo` varchar(100) DEFAULT NULL,
  `gstin` varchar(500) DEFAULT NULL,
  `approval` int(11) NOT NULL DEFAULT '0',
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `companymaster`
--

INSERT INTO `companymaster` (`id`, `name`, `owner`, `address_ln1`, `address_ln2`, `mobile1`, `mobile2`, `email`, `website`, `logo`, `gstin`, `approval`, `createddate`, `createdby`) VALUES
(1, 'Mayur Mhatre Company', 'Mayur Mhatre', 'PN-144,New mhada colony,Pawar Nagar', 'Thane west 400610', 9768241151, NULL, 'mhatremayur2520@gmail.com', ' ', 'file-1546237664168..png', NULL, 1, '2018-12-31 15:23:31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `customermaster`
--

CREATE TABLE `customermaster` (
  `id` int(11) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `mobile` bigint(20) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `address` varchar(1500) DEFAULT NULL,
  `ceateddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customermaster`
--

INSERT INTO `customermaster` (`id`, `name`, `mobile`, `email`, `address`, `ceateddate`, `createdby`, `companyid`) VALUES
(1, 'Mayur Mhatre', 9768241151, 'mhatre@gmail.com', 'Pawar ngar,Thane west,400610', '2019-01-03 12:59:31', 2, 1),
(2, 'Mayur P', 9767562526, 'pmayur@gmail.com', 'Thane', '2019-01-03 13:00:02', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL,
  `description` varchar(1500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `createddate`, `createdby`, `companyid`, `description`) VALUES
(1, 'weeew', '2019-01-19 15:36:13', 2, 1, 'weweew'),
(2, 'wewe', '2019-01-19 15:36:20', 2, 1, 'wewe'),
(3, 'wewewe', '2019-01-19 15:36:24', 2, 1, 'wewewe'),
(4, 'wewewewe', '2019-01-19 15:36:29', 2, 1, 'wewewewe'),
(5, 'wewewe', '2019-01-19 15:36:35', 2, 1, 'wewewewe'),
(6, 'wewe', '2019-01-19 15:36:40', 2, 1, 'wewewe'),
(7, 'we', '2019-01-19 15:36:44', 2, 1, 'we'),
(8, 'we', '2019-01-19 15:36:48', 2, 1, 'we'),
(9, 'we', '2019-01-19 15:36:55', 2, 1, 'we'),
(10, 'we', '2019-01-19 15:36:59', 2, 1, 'we'),
(11, 'we', '2019-01-19 15:37:03', 2, 1, 'we');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int(11) NOT NULL,
  `orderid` int(11) DEFAULT NULL,
  `productid` int(11) DEFAULT NULL,
  `mrp` double DEFAULT NULL,
  `qty` double DEFAULT NULL,
  `freeqty` double DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`id`, `orderid`, `productid`, `mrp`, `qty`, `freeqty`) VALUES
(1, 1, 5, 24, 3, 0),
(3, 2, 5, 24, 1, 0),
(4, 2, 6, 36, 1, 0),
(5, 2, 8, 5, 1, 0),
(6, 3, 5, 24, 2, 0),
(7, 3, 6, 36, 2, 0),
(8, 4, 5, 24, 1, 0),
(9, 4, 6, 36, 1, 0),
(10, 4, 8, 5, 1, 0),
(11, 1, 7, 7, 10, 0),
(12, 1, 8, 5, 10, 0),
(13, 5, 5, 24, 1, 0),
(14, 5, 6, 36, 1, 0),
(15, 5, 7, 7, 1, 0),
(16, 5, 8, 5, 1, 0),
(17, 5, 11, 20, 1, 0),
(18, 5, 10, 75, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ordermaster`
--

CREATE TABLE `ordermaster` (
  `id` int(11) NOT NULL,
  `cutomerid` int(11) DEFAULT '0',
  `paymentsts` varchar(50) DEFAULT NULL,
  `paidamount` double DEFAULT NULL,
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ordermaster`
--

INSERT INTO `ordermaster` (`id`, `cutomerid`, `paymentsts`, `paidamount`, `createddate`, `createdby`, `companyid`) VALUES
(1, 1, 'undefined', 192, '2019-01-03 12:59:31', 2, 1),
(2, 2, 'Full Paid', 65, '2019-02-06 13:00:02', 2, 1),
(3, 1, 'Full Paid', 200, '2019-01-03 12:12:31', 2, 1),
(4, 2, 'Full Paid', 400, '2019-02-06 13:40:02', 2, 1),
(5, 1, 'Full Paid', 167, '2019-01-19 15:23:26', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `podetails`
--

CREATE TABLE `podetails` (
  `id` int(11) NOT NULL,
  `poid` int(11) DEFAULT NULL,
  `productid` int(11) DEFAULT NULL,
  `qty` double DEFAULT NULL,
  `freeqty` double DEFAULT NULL,
  `porate` double DEFAULT NULL,
  `taxrate` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pomaster`
--

CREATE TABLE `pomaster` (
  `id` int(11) NOT NULL,
  `vendor` varchar(1000) DEFAULT NULL,
  `createddate` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `brand` int(11) DEFAULT NULL,
  `slot` varchar(100) DEFAULT NULL,
  `mrp` double DEFAULT '0',
  `description` varchar(1000) DEFAULT NULL,
  `porate` double NOT NULL DEFAULT '0',
  `imgfile` varchar(100) DEFAULT NULL,
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `brand`, `slot`, `mrp`, `description`, `porate`, `imgfile`, `createddate`, `createdby`, `companyid`) VALUES
(1, 'TETS', 2, 'A', 20, 'TS', 0, 'file-1546258266225..jpg', '2018-12-31 17:41:06', 2, NULL),
(5, 'NoteBook', 2, 'A', 24, 'NoteBook', 0, 'file-1546405967428..jpg', '2018-12-31 19:46:31', 2, 1),
(6, 'A4 Notebook', 2, 'A', 36, 'A4 Notebook', 0, 'file-1546406296712..jpg', '2019-01-01 17:47:00', 2, 1),
(7, 'Pen', 2, 'B', 7, 'Pen', 0, 'file-1546406005974..png', '2019-01-01 17:47:27', 2, 1),
(8, 'Pencil', 2, 'B', 5, 'Pencil', 0, 'file-1546406307457..png', '2019-01-01 17:47:53', 2, 1),
(10, 'Geometry Box', 2, 'C', 75, 'Geometry Box', 0, 'file-1546406034782..png', '2019-01-02 04:48:58', 2, 1),
(11, 'Project Papers', 2, 'C', 20, 'Project Papers', 0, 'file-1546406320687..png', '2019-01-01 17:49:18', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `mobile` bigint(20) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `firstlogin` int(11) NOT NULL DEFAULT '0',
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `profilepic` varchar(500) DEFAULT NULL,
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `mobile`, `email`, `password`, `firstlogin`, `createddate`, `createdby`, `role`, `profilepic`, `companyid`) VALUES
(1, 'Mayur Mhatre', 9768241151, 'mhatre975@gmail.com', '1ea97a5957f01dbafbd41645ad591b5c', 0, '2018-12-31 10:44:49', NULL, 'Superadmin', NULL, NULL),
(2, 'Mayur Mhatre', 9768241151, 'mhatremayur2520@gmail.com', '5210bf480e9dd8131d13a04c05f0b107', 1, '2018-12-31 15:23:31', 1, 'Admin', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companymaster`
--
ALTER TABLE `companymaster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customermaster`
--
ALTER TABLE `customermaster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordermaster`
--
ALTER TABLE `ordermaster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `podetails`
--
ALTER TABLE `podetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pomaster`
--
ALTER TABLE `pomaster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `companymaster`
--
ALTER TABLE `companymaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customermaster`
--
ALTER TABLE `customermaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `ordermaster`
--
ALTER TABLE `ordermaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `podetails`
--
ALTER TABLE `podetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pomaster`
--
ALTER TABLE `pomaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

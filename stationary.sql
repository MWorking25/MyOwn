-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2019 at 01:29 PM
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
(2, 'brand 2', 'brand 3', '2018-12-31 16:37:35', 2, 1),
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
  `mobile2` bigint(20) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
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
(1, 'Mayur Mhatre Company', 'Mayur Mhatre', 'PN-144,New mhada colony,Pawar Nagar', 'Thane west 400610', 9768241151, NULL, 'mhatremayur2520@gmail.com', NULL, '', NULL, 1, '2018-12-31 15:23:31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cutomermaster`
--

CREATE TABLE `cutomermaster` (
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
-- Dumping data for table `cutomermaster`
--

INSERT INTO `cutomermaster` (`id`, `name`, `mobile`, `email`, `address`, `ceateddate`, `createdby`, `companyid`) VALUES
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
(1, 1, 5, 24, 2, 0),
(2, 1, 6, 36, 2, 0),
(3, 2, 5, 24, 1, 0),
(4, 2, 6, 36, 1, 0),
(5, 2, 8, 5, 1, 0),
(6, 3, 5, 24, 1, 0),
(7, 3, 7, 7, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `ordermaster`
--

CREATE TABLE `ordermaster` (
  `id` int(11) NOT NULL,
  `cutomerid` int(11) DEFAULT NULL,
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
(1, 1, 'Full Paid', 120, '2019-01-03 12:59:31', 2, 1),
(2, 2, 'Full Paid', 65, '2019-01-03 13:00:02', 2, 1),
(3, 2, 'Full Paid', 31, '2019-01-03 13:00:18', 2, 1);

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
(9, 'Eraser', 2, 'B', 4, 'Eraser', 0, 'file-1546406593738..jpg', '2019-01-01 17:48:20', 2, 1),
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
  `companyid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `mobile`, `email`, `password`, `firstlogin`, `createddate`, `createdby`, `role`, `companyid`) VALUES
(1, 'Mayur Mhatre', 9768241151, 'mhatre975@gmail.com', '1ea97a5957f01dbafbd41645ad591b5c', 0, '2018-12-31 10:44:49', NULL, 'Superadmin', NULL),
(2, 'Mayur Mhatre', 9768241151, 'mhatremayur2520@gmail.com', 'bca8458c3b3379e773d8ad88984816a5', 0, '2018-12-31 15:23:31', 1, 'Admin', 1);

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
-- Indexes for table `cutomermaster`
--
ALTER TABLE `cutomermaster`
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
-- AUTO_INCREMENT for table `cutomermaster`
--
ALTER TABLE `cutomermaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ordermaster`
--
ALTER TABLE `ordermaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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

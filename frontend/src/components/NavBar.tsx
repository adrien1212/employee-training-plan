// src/components/Navbar.tsx

import {
    Box,
    Flex,
    HStack,
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Link as ChakraLink,
  } from '@chakra-ui/react';
  import { Link as RouterLink } from 'react-router-dom';
  import { ChevronDownIcon } from '@chakra-ui/icons';
  
  const Navbar = () => {
    return (
      <Box bg="teal.600" px={6} py={3} mb={6}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Heading size="md" color="white">
            Company Manager
          </Heading>
          <HStack spacing={6}>
            {/* Company Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="link" color="white">
                Company
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/">Create Company</MenuItem>
              </MenuList>
            </Menu>
  
            {/* Department Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="link" color="white">
                Department
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/departments/new">Create Department</MenuItem>
                <MenuItem as={RouterLink} to="/departments">All Departments</MenuItem>
              </MenuList>
            </Menu>
  
            {/* Employee Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="link" color="white">
                Employee
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/employees/new">Create Employee</MenuItem>
                <MenuItem as={RouterLink} to="/employees">All Employees</MenuItem>
              </MenuList>
            </Menu>
  
            {/* Training Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="link" color="white">
                Training
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/trainings/new">Create Training</MenuItem>
                <MenuItem as={RouterLink} to="/trainings">All Trainings</MenuItem>
                <MenuItem as={RouterLink} to="/sessions/subscribe">Subscribe to Session</MenuItem>
              </MenuList>
            </Menu>

            {/* Company Menu */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" variant="link" color="white">
                Statistics
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">Dashboard</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
    );
  };
  
  export default Navbar;
  
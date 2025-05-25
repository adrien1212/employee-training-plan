// src/components/Layout.tsx

import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <Box px={4}>{children}</Box>
    </>
  );
};

export default Layout;

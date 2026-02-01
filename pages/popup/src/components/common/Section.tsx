import React from 'react';
import { Box } from '@mui/material';
import AccordionSection from '../AccordionSection';

interface SectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

/** Accordion section with optional icon in title. Replaces the former inline EnhancedAccordionSection. */
const Section: React.FC<SectionProps> = ({ title, children, icon }) => {
  return (
    <Box sx={{ mb: 0.5 }}>
      <AccordionSection
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
            {title}
          </Box>
        }>
        <Box sx={{ px: 0.25 }}>{children}</Box>
      </AccordionSection>
    </Box>
  );
};

export default React.memo(Section);

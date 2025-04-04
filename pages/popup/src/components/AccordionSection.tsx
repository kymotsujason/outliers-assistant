import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AccordionSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const AccordionSection: React.FC<AccordionSectionProps> = React.memo(({ title, children, defaultExpanded = false }) => (
  <Accordion defaultExpanded={defaultExpanded}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h5">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
));

export default AccordionSection;

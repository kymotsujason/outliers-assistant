import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { ProjectLayerAssignment } from '../../hooks/useUserData';

interface ProjectStatusListProps {
  projects: ProjectLayerAssignment[];
  idJson: Record<string, string>;
}

type HealthLevel = 'healthy' | 'warning' | 'error';

const healthConfig: Record<HealthLevel, string> = {
  healthy: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

const getProjectHealth = (status?: string): HealthLevel => {
  if (!status) return 'healthy';

  const lower = status.toLowerCase();
  if (lower.includes('disabled') || lower.includes('inactive') || lower.includes('paused')) return 'error';
  if (lower.includes('notasks') || lower.includes('workertagsnotmet') || lower.includes('invalidworkersource'))
    return 'warning';
  if (lower === 'nopermissionsatreviewlevel') return 'warning';

  return 'healthy';
};

const ProjectStatusList: React.FC<ProjectStatusListProps> = ({ projects, idJson }) => {
  const theme = useTheme();

  if (projects.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
        No project assignments
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {projects.map(project => {
        const health = getProjectHealth(project.status);
        const dotColor = healthConfig[health];
        const projectName = idJson[project.projectId] || project.projectId;

        return (
          <Box
            key={project.projectId}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              p: 0.75,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : undefined,
            }}>
            {/* Health dot */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />

            {/* Project name */}
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
              {projectName}
            </Typography>

            {/* Chosen badge */}
            {project.isChosen && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '0.7rem !important' }} />}
                label="Chosen"
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: '0.7rem', letterSpacing: '0.01em', '& .MuiChip-icon': { ml: 0.25 } }}
              />
            )}

            {/* Status */}
            {project.status && (
              <Typography variant="caption" sx={{ color: dotColor, fontSize: '0.8rem', flexShrink: 0 }}>
                {project.status}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default React.memo(ProjectStatusList);

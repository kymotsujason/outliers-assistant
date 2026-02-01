import React, { useMemo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import StatusCard from './StatusCard';
import type { StatusLevel } from './StatusCard';
import QuickStats from './QuickStats';
import ProjectStatusList from './ProjectStatusList';
import { useUserData } from '../../hooks/useUserData';
import { isRecord, isString, safeString, safeDate } from '../../utils/typeUtils';

interface DashboardProps {
  user: unknown;
  idJson: Record<string, string>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, idJson }) => {
  const { userData, getProjectLayerAssignments, getEmptyQueueData, getFeatureFlags } = useUserData(user);

  const projectLayers = useMemo(() => getProjectLayerAssignments(), [getProjectLayerAssignments]);
  const emptyQueueData = useMemo(() => getEmptyQueueData(), [getEmptyQueueData]);
  const featureFlags = useMemo(() => getFeatureFlags(), [getFeatureFlags]);

  // Derive account status
  const accountStatus = useMemo((): { level: StatusLevel; label: string } => {
    const status = safeString(userData?.workerStatus, '').toLowerCase();
    if (status === 'active') return { level: 'active', label: 'Active' };
    if (status === 'pending') return { level: 'warning', label: 'Pending' };
    if (status === 'suspended') return { level: 'error', label: 'Suspended' };
    if (status === 'inactive') return { level: 'inactive', label: 'Inactive' };
    return { level: 'inactive', label: status || 'Unknown' };
  }, [userData]);

  // Derive queue status
  const queueStatus = useMemo((): { level: StatusLevel; label: string; summary: string } => {
    const chosenProject = isRecord(userData?.chosenProjectLayer) && isString(userData.chosenProjectLayer.projectId);

    if (!emptyQueueData) {
      return chosenProject
        ? { level: 'active', label: 'Available', summary: 'Queue data not yet captured' }
        : { level: 'inactive', label: 'No Project', summary: 'No project selected' };
    }

    const reasons = emptyQueueData.emptyQueueReasons;
    if (!isRecord(reasons) || Object.keys(reasons).length === 0) {
      return { level: 'active', label: 'Available', summary: 'No empty queue reasons' };
    }

    // Check if any project has a blocking reason
    let hasBlockingReason = false;
    let firstReason = '';
    for (const [, reviewLevels] of Object.entries(reasons)) {
      if (isRecord(reviewLevels)) {
        for (const [, reason] of Object.entries(reviewLevels)) {
          if (isString(reason) && reason !== 'NoPermissionsAtReviewLevel') {
            hasBlockingReason = true;
            if (!firstReason) firstReason = reason;
          }
        }
      }
    }

    if (hasBlockingReason) {
      const isError =
        firstReason.toLowerCase().includes('disabled') ||
        firstReason.toLowerCase().includes('inactive') ||
        firstReason.toLowerCase().includes('paused');
      return {
        level: isError ? 'error' : 'warning',
        label: isError ? 'Blocked' : 'Limited',
        summary: firstReason,
      };
    }

    return { level: 'active', label: 'Available', summary: 'Tasks may be available' };
  }, [userData, emptyQueueData]);

  // Quick stats data
  const quickStats = useMemo(() => {
    const stats = [
      {
        label: 'Pay Multiplier',
        value: safeString(userData?.workerPayMultiplier, '1.0') + 'x',
        color: '#2196f3',
      },
      {
        label: 'Account Credit',
        value: userData?.accountCreditCents != null ? `${userData.accountCreditCents}c` : 'N/A',
      },
      {
        label: 'Last Active',
        value: userData?.lastActive ? safeDate(userData.lastActive) : 'N/A',
      },
      {
        label: 'Feature Flags',
        value: featureFlags ? `${Object.keys(featureFlags).length} flags` : '0 flags',
        color: '#ff9800',
      },
    ];
    return stats;
  }, [userData, featureFlags]);

  return (
    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
          {safeString(userData?.firstName, '')} {safeString(userData?.lastName, '')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {safeString(userData?.email, '')}
        </Typography>
      </Box>

      <Divider />

      {/* Status cards row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <StatusCard
          title="Account"
          status={accountStatus.level}
          statusLabel={accountStatus.label}
          icon={<PersonIcon sx={{ fontSize: '1rem' }} />}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Type: {safeString(userData?.accountType, 'N/A')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Role: {safeString(userData?.accountRole, 'N/A')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Team: {safeString(userData?.teamRole, 'N/A')}
            </Typography>
          </Box>
        </StatusCard>

        <StatusCard
          title="Queue"
          status={queueStatus.level}
          statusLabel={queueStatus.label}
          icon={<ReportProblemIcon sx={{ fontSize: '1rem' }} />}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' }}>
            {queueStatus.summary}
          </Typography>
          {emptyQueueData?.requestedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.25, fontSize: '0.8rem' }}>
              Last checked: {safeDate(emptyQueueData.requestedAt)}
            </Typography>
          )}
        </StatusCard>
      </Box>

      {/* Quick stats */}
      <QuickStats stats={quickStats} />

      {/* Projects */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <AssignmentIcon sx={{ fontSize: '0.9rem' }} color="primary" />
          <Typography variant="subtitle2" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
            Projects ({projectLayers.length})
          </Typography>
        </Box>
        <ProjectStatusList projects={projectLayers} idJson={idJson} />
      </Box>
    </Box>
  );
};

export default React.memo(Dashboard);

import React from 'react';
import { Typography, Box, Chip, Badge, useTheme } from '@mui/material';
import AccordionSection from './components/AccordionSection';
import { InfoIconWithTooltip } from './components/InfoTooltip';
import { isArray, safeDate, safeString, isBoolean } from './utils/typeUtils';
import { useUserData } from './hooks/useUserData';
import TeamAssignmentList from './components/TeamAssignmentList';
// Removed unused ProjectAssignmentList import
import EmptyQueueReasons from './components/EmptyQueueReasons';
import FeatureFlags from './components/FeatureFlags';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

// Define prop types
interface UserProfileProps {
  user: unknown;
  idJson: Record<string, string>;
}

// Custom formatted value component for better display of different data types
const FormattedValue: React.FC<{ value: unknown }> = ({ value }) => {
  const theme = useTheme();

  // Boolean values
  if (isBoolean(value)) {
    return (
      <Chip
        icon={value ? <CheckCircleIcon /> : <CancelIcon />}
        label={value ? 'Yes' : 'No'}
        size="small"
        color={value ? 'success' : 'default'}
        sx={{ fontWeight: 500 }}
      />
    );
  }

  // Arrays
  if (isArray(value) && typeof value !== 'string') {
    if (value.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Empty array
        </Typography>
      );
    }

    return (
      <Badge badgeContent={value.length} color="primary" sx={{ marginRight: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            maxHeight: '120px',
            overflowY: 'auto',
            p: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            background: theme.palette.background.paper,
          }}>
          {value.map((item: unknown, index: number) => (
            <Chip
              key={index}
              label={typeof item === 'object' ? JSON.stringify(item) : String(item)}
              size="small"
              variant="outlined"
              sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
            />
          ))}
        </Box>
      </Badge>
    );
  }

  // Status values (special treatment)
  if (typeof value === 'string' && ['active', 'pending', 'inactive', 'suspended'].includes(value.toLowerCase())) {
    const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      active: 'success',
      pending: 'warning',
      inactive: 'default',
      suspended: 'error',
    };

    return (
      <Chip
        label={value}
        size="small"
        color={statusColors[value.toLowerCase()] || 'default'}
        sx={{ fontWeight: 500 }}
      />
    );
  }

  // Default text representation
  return (
    <Typography
      variant="body2"
      sx={{
        wordBreak: 'break-word',
        fontFamily: 'monospace',
        backgroundColor: theme.palette.background.paper,
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
      }}>
      {String(value)}
    </Typography>
  );
};

// Enhanced InfoTooltip using FormattedValue
const EnhancedInfoTooltip: React.FC<{ label: string; value: unknown; tooltip: string; icon?: React.ReactNode }> = ({
  label,
  value,
  tooltip,
  icon,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 0.25,
        mb: 0.25,
        borderRadius: 1,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}>
      {icon && <Box sx={{ mr: 1, mt: 0.5 }}>{icon}</Box>}

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 0.5 }}>
            {label}
          </Typography>
          <InfoIconWithTooltip tooltip={tooltip} />
        </Box>

        <Box sx={{ ml: 0.25 }}>{React.isValidElement(value) ? value : <FormattedValue value={value} />}</Box>
      </Box>
    </Box>
  );
};

// Enhanced AccordionSection
const EnhancedAccordionSection: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, children, icon }) => {
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
}; // End of EnhancedAccordionSection

import type { ProjectLayerAssignment } from './hooks/useUserData'; // Use type import

const UserProfile: React.FC<UserProfileProps> = ({ user, idJson }) => {
  // Update destructuring to use the new function
  const { userData, getProjectLayerAssignments, getEmptyQueueData, getTeamAssignments, getFeatureFlags } =
    useUserData(user);

  // Get the project layer assignments
  const projectLayers = getProjectLayerAssignments();

  return (
    <Box sx={{ p: 0.5 }}>
      {/* Personal Information Section */}
      <EnhancedAccordionSection title="Personal Information" icon={<PersonIcon color="primary" />}>
        <EnhancedInfoTooltip label="ID" value={safeString(userData?.id)} tooltip="The unique identifier for the user" />
        <EnhancedInfoTooltip label="Email" value={safeString(userData?.email)} tooltip="The user's email address" />
        <EnhancedInfoTooltip
          label="First Name"
          value={safeString(userData?.firstName)}
          tooltip="The user's first name"
        />
        <EnhancedInfoTooltip label="Last Name" value={safeString(userData?.lastName)} tooltip="The user's last name" />
        <EnhancedInfoTooltip
          label="Phone Number"
          value={safeString(userData?.phoneNumber)}
          tooltip="The user's phone number"
        />
        <EnhancedInfoTooltip
          label="Country Code"
          value={safeString(userData?.countryCode)}
          tooltip="The country code associated with the user's phone number"
        />
        <EnhancedInfoTooltip
          label="IP Country Code"
          value={safeString(userData?.ipCountryCode)}
          tooltip="The country code determined from the user's IP address"
        />
        <EnhancedInfoTooltip label="Age Range" value={safeString(userData?.ageRange)} tooltip="The user's age range" />
      </EnhancedAccordionSection>
      {/* Account Details Section */}
      <EnhancedAccordionSection title="Account Details" icon={<AccountCircleIcon color="primary" />}>
        <EnhancedInfoTooltip
          label="Account Type"
          value={safeString(userData?.accountType)}
          tooltip="The type of account the user has"
        />
        <EnhancedInfoTooltip
          label="Invite Code"
          value={safeString(userData?.inviteCode)}
          tooltip="The user's invite code"
        />
        <EnhancedInfoTooltip
          label="Worker Pay Multiplier"
          value={safeString(userData?.workerPayMultiplier)}
          tooltip="Multiplier applied to worker's pay"
        />
        <EnhancedInfoTooltip
          label="Created Date"
          value={safeDate(userData?.createdDate)}
          tooltip="The date the account was created"
        />
        <EnhancedInfoTooltip
          label="Account Role"
          value={safeString(userData?.accountRole)}
          tooltip="The role assigned to the account"
        />
        <EnhancedInfoTooltip
          label="Customer Review Enabled"
          value={userData?.customerReviewEnabled}
          tooltip="Is customer review enabled for the user?"
        />
        <EnhancedInfoTooltip
          label="Google OAuth ID"
          value={safeString(userData?.googleOAuthId)}
          tooltip="The user's Google OAuth ID"
        />
        <EnhancedInfoTooltip
          label="Worker Slack ID"
          value={safeString(userData?.workerSlackId)}
          tooltip="The user's Slack ID for workers"
        />
        <EnhancedInfoTooltip
          label="Scale Discourse ID"
          value={safeString(userData?.scaleDiscourseId)}
          tooltip="The user's Scale Discourse ID"
        />
        <EnhancedInfoTooltip
          label="Worker Status"
          value={safeString(userData?.workerStatus)}
          tooltip="The current status of the worker"
        />
        <EnhancedInfoTooltip
          label="Account Credit Cents"
          value={safeString(userData?.accountCreditCents)}
          tooltip="The account's credit in cents"
        />
        <EnhancedInfoTooltip
          label="Last Online Datetime"
          value={safeDate(userData?.lastOnlineDatetime)}
          tooltip="The last time the user was online"
        />
        <EnhancedInfoTooltip
          label="Last Active"
          value={safeDate(userData?.lastActive)}
          tooltip="The last time the user was active"
        />
      </EnhancedAccordionSection>
      {/* Project Assignments Section */}
      <EnhancedAccordionSection
        title={
          <>
            Project Assignments <InfoIconWithTooltip tooltip="If this is empty, check Last Empty Queue Event" />
          </>
        }
        icon={<AssignmentIcon color="primary" />}>
        {projectLayers.length > 0 ? (
          projectLayers.map((layer: ProjectLayerAssignment) => {
            // Updated label and tooltip generation
            const label = layer.isChosen ? `Chosen Project` : `Assigned Project`;
            const statusText = layer.status ? ` | Status: ${layer.status}` : '';
            const expiryText = layer.expiresAt ? ` | Expires: ${layer.expiresAt}` : '';
            const tooltip = `Project ID: ${layer.projectId}${statusText}${expiryText}`;
            const displayValue = `${layer.projectId}${statusText}`; // Show ID and status

            return (
              <EnhancedInfoTooltip
                key={layer.projectId}
                label={label}
                value={displayValue} // Display ID and status
                tooltip={tooltip}
              />
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1, textAlign: 'center' }}>
            No project layer assignments found.
          </Typography>
        )}
      </EnhancedAccordionSection>
      {/* Permissions and Roles Section */}
      <EnhancedAccordionSection
        title={
          <>
            Permissions and Roles{' '}
            <InfoIconWithTooltip tooltip="Team role is your team status, admin means you probably aren't in one" />
          </>
        }
        icon={<SecurityIcon color="primary" />}>
        <EnhancedInfoTooltip
          label="Team Role"
          value={safeString(userData?.teamRole)}
          tooltip="The user's role within the team"
        />
        <EnhancedInfoTooltip
          label="Can Edit Task Types"
          value={isArray(userData?.canEditTaskTypes) ? userData.canEditTaskTypes : []}
          tooltip="Task types the user can edit"
        />
        <EnhancedInfoTooltip
          label="Training Rewards Eligible"
          value={userData?.trainingRewardsEligible}
          tooltip="Is the user eligible for training rewards?"
        />
        <EnhancedInfoTooltip
          label="Training Rewards Required Earnings"
          value={safeString(userData?.trainingRewardsRequiredEarnings)}
          tooltip="Required earnings for training rewards eligibility"
        />
        <EnhancedInfoTooltip
          label="Can Access Lidar"
          value={userData?.canAccessLidar}
          tooltip="Does the user have access to LiDAR projects?"
        />
        <EnhancedInfoTooltip
          label="Phone Number Verified"
          value={userData?.phoneNumberVerified}
          tooltip="Has the user's phone number been verified?"
        />
        <EnhancedInfoTooltip
          label="Requires Onboarding Profiling"
          value={userData?.requiresOnboardingProfiling}
          tooltip="Does the user require onboarding profiling?"
        />
        <EnhancedInfoTooltip
          label="Onboarding Profiling Completed"
          value={userData?.onboardingProfilingCompleted}
          tooltip="Has the user completed onboarding profiling?"
        />
        <EnhancedInfoTooltip
          label="Onboarding Profiling Worker Skills Pending"
          value={userData?.onboardingProfilingWorkerSkillsPending}
          tooltip="Are the user's worker skills pending after onboarding profiling?"
        />
        <EnhancedInfoTooltip
          label="Intro Course Completed"
          value={userData?.introCourseCompleted}
          tooltip="Has the user completed the introductory course?"
        />
      </EnhancedAccordionSection>
      {/* Last Empty Queue Event Section */}
      <EnhancedAccordionSection
        title={
          <>
            Last Empty Queue Event{' '}
            <InfoIconWithTooltip tooltip="Some common problems (all speculative): NoTasks (Queue is empty), Disabled (Removed from project), WorkerTagsNotMet (In project, but tasks hidden), PausedProject (Project paused), InactiveProject (Project inactive), InvalidWorkerSource (No idea)" />{' '}
            <InfoIconWithTooltip tooltip="Review Level is your task role: -1 is attempter, 0 is reviewer, 10 is senior reviewer, allReviewLevels or N/A means no role probably" />
          </>
        }
        icon={<ErrorIcon color="primary" />}>
        {(() => {
          const emptyQueueData = getEmptyQueueData();
          if (!emptyQueueData)
            return (
              <Box
                sx={{
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}>
                <HelpIcon sx={{ mr: 0.5 }} />
                <Typography variant="body2">No Empty Queue Data Available</Typography>
              </Box>
            );

          return (
            <>
              <EnhancedInfoTooltip
                label="Server-Side Request ID"
                value={safeString(emptyQueueData.serverSideRequestId)}
                tooltip="The server-side request ID for the last empty queue event"
              />
              <EnhancedInfoTooltip
                label="User ID"
                value={safeString(emptyQueueData.userId)}
                tooltip="The user ID associated with the event"
              />
              <EnhancedInfoTooltip
                label="Active Worker Team"
                value={safeString(emptyQueueData.activeWorkerTeam)}
                tooltip="The active worker team during the event"
              />
              <EnhancedInfoTooltip
                label="Requested At"
                value={safeDate(emptyQueueData.requestedAt)}
                tooltip="The time when the task was requested"
              />
              <EnhancedInfoTooltip
                label="Current Primary Team Assignments"
                value={
                  <TeamAssignmentList
                    assignments={getTeamAssignments('currentPrimaryTeamAssignments')}
                    idJson={idJson}
                  />
                }
                tooltip="The primary team assignments at the time of the event"
              />
              <EnhancedInfoTooltip
                label="Current Secondary Team Assignments"
                value={
                  <TeamAssignmentList
                    assignments={getTeamAssignments('currentSecondaryTeamAssignments')}
                    idJson={idJson}
                  />
                }
                tooltip="The secondary team assignments at the time of the event"
              />
              <EnhancedInfoTooltip
                label="Empty Queue Reasons"
                value={<EmptyQueueReasons emptyQueueReasons={emptyQueueData.emptyQueueReasons} idJson={idJson} />}
                tooltip="Reasons why the queue was empty for the user"
              />
            </>
          );
        })()}
      </EnhancedAccordionSection>
      {/* Permissions Section */}
      <EnhancedAccordionSection title="Permissions" icon={<SettingsIcon color="primary" />}>
        <EnhancedInfoTooltip
          label="Allowed Task Types"
          value={isArray(userData?.allowedTaskTypes) ? userData.allowedTaskTypes : []}
          tooltip="Task types the user is allowed to access"
        />
        <EnhancedInfoTooltip label="Is Reviewer" value={userData?.isReviewer} tooltip="Is the user a reviewer?" />
        <EnhancedInfoTooltip
          label="Is Remotask Pro"
          value={userData?.isRemotaskPro}
          tooltip="Is the user a Remotask Pro?"
        />
        <EnhancedInfoTooltip
          label="Has Training Feedback Permission"
          value={userData?.hasTrainingFeedbackPermission}
          tooltip="Does the user have permission to provide training feedback?"
        />
        <EnhancedInfoTooltip
          label="Force SEON Transaction"
          value={userData?.forceSeonTransaction}
          tooltip="Should the user undergo a SEON fraud check?"
        />
        <EnhancedInfoTooltip
          label="Persona Verification Course Bypass"
          value={userData?.personaVerificationCourseBypass}
          tooltip="Has the user bypassed Persona verification for the course?"
        />
        <EnhancedInfoTooltip
          label="Reverification Info"
          value={userData?.reverificationInfo !== undefined ? userData.reverificationInfo : 'N/A'}
          tooltip="Information about user's reverification status"
        />
      </EnhancedAccordionSection>
      {/* Feature Flags Section */}
      <EnhancedAccordionSection title="Feature Flags" icon={<FlagIcon color="primary" />}>
        <FeatureFlags featureFlags={getFeatureFlags()} />
      </EnhancedAccordionSection>
    </Box>
  );
};

export default React.memo(UserProfile);

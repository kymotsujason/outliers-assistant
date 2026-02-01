import React from 'react';
import { Typography, Box } from '@mui/material';
import { InfoIconWithTooltip } from './components/InfoTooltip';
import { isArray, safeDate, safeString } from './utils/typeUtils';
import { useUserData } from './hooks/useUserData';
import type { ProjectLayerAssignment } from './hooks/useUserData';
import TeamAssignmentList from './components/TeamAssignmentList';
import EmptyQueueReasons from './components/EmptyQueueReasons';
import FeatureFlags from './components/FeatureFlags';
import InfoRow from './components/common/InfoRow';
import Section from './components/common/Section';

import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';
import HelpIcon from '@mui/icons-material/Help';

interface UserProfileProps {
  user: unknown;
  idJson: Record<string, string>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, idJson }) => {
  const { userData, getProjectLayerAssignments, getEmptyQueueData, getTeamAssignments, getFeatureFlags } =
    useUserData(user);

  const projectLayers = getProjectLayerAssignments();

  return (
    <Box sx={{ p: 0.5 }}>
      <Section title="Personal Information" icon={<PersonIcon color="primary" />}>
        <InfoRow label="ID" value={safeString(userData?.id)} tooltip="The unique identifier for the user" />
        <InfoRow label="Email" value={safeString(userData?.email)} tooltip="The user's email address" />
        <InfoRow label="First Name" value={safeString(userData?.firstName)} tooltip="The user's first name" />
        <InfoRow label="Last Name" value={safeString(userData?.lastName)} tooltip="The user's last name" />
        <InfoRow label="Phone Number" value={safeString(userData?.phoneNumber)} tooltip="The user's phone number" />
        <InfoRow
          label="Country Code"
          value={safeString(userData?.countryCode)}
          tooltip="The country code associated with the user's phone number"
        />
        <InfoRow
          label="IP Country Code"
          value={safeString(userData?.ipCountryCode)}
          tooltip="The country code determined from the user's IP address"
        />
        <InfoRow label="Age Range" value={safeString(userData?.ageRange)} tooltip="The user's age range" />
      </Section>

      <Section title="Account Details" icon={<AccountCircleIcon color="primary" />}>
        <InfoRow label="Account Type" value={safeString(userData?.accountType)} tooltip="The type of account" />
        <InfoRow label="Invite Code" value={safeString(userData?.inviteCode)} tooltip="The user's invite code" />
        <InfoRow
          label="Worker Pay Multiplier"
          value={safeString(userData?.workerPayMultiplier)}
          tooltip="Multiplier applied to worker's pay"
        />
        <InfoRow
          label="Created Date"
          value={safeDate(userData?.createdDate)}
          tooltip="The date the account was created"
        />
        <InfoRow
          label="Account Role"
          value={safeString(userData?.accountRole)}
          tooltip="The role assigned to the account"
        />
        <InfoRow
          label="Customer Review Enabled"
          value={userData?.customerReviewEnabled}
          tooltip="Is customer review enabled for the user?"
        />
        <InfoRow
          label="Google OAuth ID"
          value={safeString(userData?.googleOAuthId)}
          tooltip="The user's Google OAuth ID"
        />
        <InfoRow label="Worker Slack ID" value={safeString(userData?.workerSlackId)} tooltip="The user's Slack ID" />
        <InfoRow
          label="Scale Discourse ID"
          value={safeString(userData?.scaleDiscourseId)}
          tooltip="The user's Scale Discourse ID"
        />
        <InfoRow label="Worker Status" value={safeString(userData?.workerStatus)} tooltip="The current worker status" />
        <InfoRow
          label="Account Credit Cents"
          value={safeString(userData?.accountCreditCents)}
          tooltip="The account's credit in cents"
        />
        <InfoRow
          label="Last Online Datetime"
          value={safeDate(userData?.lastOnlineDatetime)}
          tooltip="The last time the user was online"
        />
        <InfoRow
          label="Last Active"
          value={safeDate(userData?.lastActive)}
          tooltip="The last time the user was active"
        />
      </Section>

      <Section
        title={
          <>
            Project Assignments <InfoIconWithTooltip tooltip="If this is empty, check Last Empty Queue Event" />
          </>
        }
        icon={<AssignmentIcon color="primary" />}>
        {projectLayers.length > 0 ? (
          projectLayers.map((layer: ProjectLayerAssignment) => {
            const label = layer.isChosen ? `Chosen Project` : `Assigned Project`;
            const statusText = layer.status ? ` | Status: ${layer.status}` : '';
            const expiryText = layer.expiresAt ? ` | Expires: ${layer.expiresAt}` : '';
            const tooltip = `Project ID: ${layer.projectId}${statusText}${expiryText}`;
            const displayValue = `${layer.projectId}${statusText}`;

            return <InfoRow key={layer.projectId} label={label} value={displayValue} tooltip={tooltip} />;
          })
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1, textAlign: 'center' }}>
            No project layer assignments found.
          </Typography>
        )}
      </Section>

      <Section
        title={
          <>
            Permissions and Roles{' '}
            <InfoIconWithTooltip tooltip="Team role is your team status, admin means you probably aren't in one" />
          </>
        }
        icon={<SecurityIcon color="primary" />}>
        <InfoRow label="Team Role" value={safeString(userData?.teamRole)} tooltip="The user's role within the team" />
        <InfoRow
          label="Can Edit Task Types"
          value={isArray(userData?.canEditTaskTypes) ? userData.canEditTaskTypes : []}
          tooltip="Task types the user can edit"
        />
        <InfoRow
          label="Training Rewards Eligible"
          value={userData?.trainingRewardsEligible}
          tooltip="Is the user eligible for training rewards?"
        />
        <InfoRow
          label="Training Rewards Required Earnings"
          value={safeString(userData?.trainingRewardsRequiredEarnings)}
          tooltip="Required earnings for training rewards eligibility"
        />
        <InfoRow label="Can Access Lidar" value={userData?.canAccessLidar} tooltip="Does the user have LiDAR access?" />
        <InfoRow
          label="Phone Number Verified"
          value={userData?.phoneNumberVerified}
          tooltip="Has the user's phone number been verified?"
        />
        <InfoRow
          label="Requires Onboarding Profiling"
          value={userData?.requiresOnboardingProfiling}
          tooltip="Does the user require onboarding profiling?"
        />
        <InfoRow
          label="Onboarding Profiling Completed"
          value={userData?.onboardingProfilingCompleted}
          tooltip="Has the user completed onboarding profiling?"
        />
        <InfoRow
          label="Onboarding Profiling Worker Skills Pending"
          value={userData?.onboardingProfilingWorkerSkillsPending}
          tooltip="Are the user's worker skills pending?"
        />
        <InfoRow
          label="Intro Course Completed"
          value={userData?.introCourseCompleted}
          tooltip="Has the user completed the introductory course?"
        />
      </Section>

      <Section
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
              <InfoRow
                label="Server-Side Request ID"
                value={safeString(emptyQueueData.serverSideRequestId)}
                tooltip="The server-side request ID for the last empty queue event"
              />
              <InfoRow
                label="User ID"
                value={safeString(emptyQueueData.userId)}
                tooltip="The user ID associated with the event"
              />
              <InfoRow
                label="Active Worker Team"
                value={safeString(emptyQueueData.activeWorkerTeam)}
                tooltip="The active worker team during the event"
              />
              <InfoRow
                label="Requested At"
                value={safeDate(emptyQueueData.requestedAt)}
                tooltip="The time when the task was requested"
              />
              <InfoRow
                label="Current Primary Team Assignments"
                value={
                  <TeamAssignmentList
                    assignments={getTeamAssignments('currentPrimaryTeamAssignments')}
                    idJson={idJson}
                  />
                }
                tooltip="The primary team assignments at the time of the event"
              />
              <InfoRow
                label="Current Secondary Team Assignments"
                value={
                  <TeamAssignmentList
                    assignments={getTeamAssignments('currentSecondaryTeamAssignments')}
                    idJson={idJson}
                  />
                }
                tooltip="The secondary team assignments at the time of the event"
              />
              <InfoRow
                label="Empty Queue Reasons"
                value={<EmptyQueueReasons emptyQueueReasons={emptyQueueData.emptyQueueReasons} idJson={idJson} />}
                tooltip="Reasons why the queue was empty for the user"
              />
            </>
          );
        })()}
      </Section>

      <Section title="Permissions" icon={<SettingsIcon color="primary" />}>
        <InfoRow
          label="Allowed Task Types"
          value={isArray(userData?.allowedTaskTypes) ? userData.allowedTaskTypes : []}
          tooltip="Task types the user is allowed to access"
        />
        <InfoRow label="Is Reviewer" value={userData?.isReviewer} tooltip="Is the user a reviewer?" />
        <InfoRow label="Is Remotask Pro" value={userData?.isRemotaskPro} tooltip="Is the user a Remotask Pro?" />
        <InfoRow
          label="Has Training Feedback Permission"
          value={userData?.hasTrainingFeedbackPermission}
          tooltip="Does the user have permission to provide training feedback?"
        />
        <InfoRow
          label="Force SEON Transaction"
          value={userData?.forceSeonTransaction}
          tooltip="Should the user undergo a SEON fraud check?"
        />
        <InfoRow
          label="Persona Verification Course Bypass"
          value={userData?.personaVerificationCourseBypass}
          tooltip="Has the user bypassed Persona verification?"
        />
        <InfoRow
          label="Reverification Info"
          value={userData?.reverificationInfo !== undefined ? userData.reverificationInfo : 'N/A'}
          tooltip="Information about user's reverification status"
        />
      </Section>

      <Section title="Feature Flags" icon={<FlagIcon color="primary" />}>
        <FeatureFlags featureFlags={getFeatureFlags()} />
      </Section>
    </Box>
  );
};

export default React.memo(UserProfile);

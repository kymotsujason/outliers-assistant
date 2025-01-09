import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const UserProfile = ({ user, idJson }) => (
  <div>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Personal Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>ID: {user.id}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>First Name: {user.firstName}</Typography>
        <Typography>Last Name: {user.lastName}</Typography>
        <Typography>Phone Number: {user.phoneNumber}</Typography>
        <Typography>Country Code: {user.countryCode}</Typography>
        <Typography>IP Country Code: {user.ipCountryCode}</Typography>
        <Typography>Age Range: {user.ageRange}</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Account Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Account Type: {user.accountType}</Typography>
        <Typography>Invite Code: {user.inviteCode}</Typography>
        <Typography>
          Worker Pay Multiplier: {user.workerPayMultiplier}
        </Typography>
        <Typography>
          Created Date: {new Date(user.createdDate).toLocaleString()}
        </Typography>
        <Typography>Account Role: {user.accountRole}</Typography>
        <Typography>
          Customer Review Enabled: {String(user.customerReviewEnabled)}
        </Typography>
        <Typography>Google OAuth ID: {user.googleOAuthId}</Typography>
        <Typography>Worker Slack ID: {user.workerSlackId}</Typography>
        <Typography>Scale Discourse ID: {user.scaleDiscourseId}</Typography>
        <Typography>Worker Status: {user.workerStatus}</Typography>
        <Typography>Account Credit Cents: {user.accountCreditCents}</Typography>
        <Typography>
          Last Online Datetime:{' '}
          {new Date(user.lastOnlineDatetime).toLocaleString()}
        </Typography>
        <Typography>
          Last Active: {new Date(user.lastActive).toLocaleString()}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Project Assignments{' '}
          <Tooltip title="If this is empty, check Last Empty Queue Event" arrow>
            <InfoIcon />
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Primary Projects: {user.tieredAssignedProjects?.primary.join(', ')}
        </Typography>
        <Typography>
          Secondary Projects:{' '}
          {user.tieredAssignedProjects?.secondary.join(', ')}
        </Typography>
        <Typography>
          Tertiary Projects: {user.tieredAssignedProjects?.tertiary.join(', ')}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Permissions and Roles{' '}
          <Tooltip
            title="Team role is your team status, admin means you probably aren't in one"
            arrow
          >
            <InfoIcon />
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Team Role: {user.teamRole}</Typography>
        <Typography>
          Can Edit Task Types: {user.canEditTaskTypes.join(', ')}
        </Typography>
        <Typography>
          Training Rewards Eligible: {String(user.trainingRewardsEligible)}
        </Typography>
        <Typography>
          Training Rewards Required Earnings:{' '}
          {user.trainingRewardsRequiredEarnings}
        </Typography>
        <Typography>Can Access Lidar: {String(user.canAccessLidar)}</Typography>
        <Typography>
          Phone Number Verified: {String(user.phoneNumberVerified)}
        </Typography>
        <Typography>
          Requires Onboarding Profiling:{' '}
          {String(user.requiresOnboardingProfiling)}
        </Typography>
        <Typography>
          Onboarding Profiling Completed:{' '}
          {String(user.onboardingProfilingCompleted)}
        </Typography>
        <Typography>
          Onboarding Profiling Worker Skills Pending:{' '}
          {String(user.onboardingProfilingWorkerSkillsPending)}
        </Typography>
        <Typography>
          Intro Course Completed: {String(user.introCourseCompleted)}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Additional Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Customer Type: {user.customerType}</Typography>
        <Typography>Preferred Timezone: {user.preferredTimezone}</Typography>
        <Typography>Verification Status: {user.verificationStatus}</Typography>
        <Typography>Tags: {user.tags.join(', ')}</Typography>
        <Typography>Active Worker Team: {user.activeWorkerTeam}</Typography>
        <Typography>Rapid Customer: {String(user.rapidCustomer)}</Typography>
        <Typography>
          Disable Rapid Emails: {String(user.disableRapidEmails)}
        </Typography>
        <Typography>Studio Customer: {String(user.studioCustomer)}</Typography>
        <Typography>
          Studio Subscription Tier: {user.studioSubscriptionTier}
        </Typography>
        <Typography>RTE Info: {JSON.stringify(user.rteInfo)}</Typography>
        <Typography>
          Assigned Project Layers: {user.assignedProjectLayers.join(', ')}
        </Typography>
        <Typography>
          Last Dismissed Announcements:{' '}
          {JSON.stringify(user.lastDismissedAnnouncements)}
        </Typography>
        <Typography>Autogenerated: {String(user.autogenerated)}</Typography>
        <Typography>
          Project Groups: {JSON.stringify(user.projectGroups)}
        </Typography>
        <Typography>
          Previous Stripe Customer ID: {user.previousStripeCustomerId}
        </Typography>
        <Typography>
          Last 2FA Phone Verification Date:{' '}
          {new Date(user.last2FAPhoneVerificationDate).toLocaleString()}
        </Typography>
        <Typography>
          Is Permanent 2FA Bypass: {String(user.isPermanent2FABypass)}
        </Typography>
        <Typography>
          Phone Number Alphabetic Country Code:{' '}
          {user.phoneNumberAlphabeticCountryCode}
        </Typography>
        <Typography>
          Phone Number Calling Country Code:{' '}
          {user.phoneNumberCallingCountryCode}
        </Typography>
        <Typography>Local Phone Number: {user.localPhoneNumber}</Typography>
        <Typography>
          Verified Country Code: {user.verifiedCountryCode}
        </Typography>
        <Typography>
          Last Phone Number Reset Date:{' '}
          {new Date(user.lastPhoneNumberResetDate).toLocaleString()}
        </Typography>
        <Typography>SMS Opt-In: {String(user.smsOptIn)}</Typography>
        <Typography>
          GreenHouse Resume Link: {user.greenHouseResumeLink}
        </Typography>
        <Typography>UTM Source: {user.utmSource}</Typography>
        <Typography>
          Hyperwallet User Token: {user.hyperwalletUserToken}
        </Typography>
        <Typography>
          Hyperwallet Bank Account Token: {user.hyperwalletBankAccountToken}
        </Typography>
        <Typography>
          Hyperwallet Bank Account 4 Digits:{' '}
          {user.hyperwalletBankAccount4Digits}
        </Typography>
        <Typography>
          Hyperwallet PayPal Token: {user.hyperwalletPaypalToken}
        </Typography>
        <Typography>
          Hyperwallet PayPal Email: {user.hyperwalletPaypalEmail}
        </Typography>
        <Typography>
          Hyperwallet PayPal Denied: {String(user.hyperwalletPaypalDenied)}
        </Typography>
        <Typography>Gen AI Tasker: {String(user.genAiTasker)}</Typography>
        <Typography>
          Dummy Account Emails: {user.dummyAccountEmails.join(', ')}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Last Empty Queue Event{' '}
          <Tooltip
            title="Some common problems (all speculative): NoTasks (Queue is empty), Disabled (Removed from project), WorkerTagsNotMet (In project, but tasks hidden), PausedProject (Project paused), InactiveProject (Project inactive), InvalidWorkerSource (No idea)"
            arrow
          >
            <InfoIcon />
          </Tooltip>{' '}
          <Tooltip
            title="Review Level is your task role: -1 is attempter, 0 is reviewer, 10 is senior reviewer, allReviewLevels or N/A means no role probably"
            arrow
          >
            <InfoIcon />
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Server-Side Request ID:{' '}
          {user.lastEmptyQueueEvent?.serverSideRequestId}
        </Typography>
        <Typography>User ID: {user.lastEmptyQueueEvent?.userId}</Typography>
        <Typography>
          Active Worker Team: {user.lastEmptyQueueEvent?.activeWorkerTeam}
        </Typography>
        <Typography>
          Requested At:{' '}
          {new Date(user.lastEmptyQueueEvent?.requestedAt).toLocaleString()}
        </Typography>
        <Typography>
          Current Primary Team Assignments:{' '}
          {user.lastEmptyQueueEvent?.currentPrimaryTeamAssignments?.map(
            (project, index) => (
              <span key={index}>
                {idJson[project.projectId]
                  ? idJson[project.projectId]
                  : project.projectName || project.projectId}{' '}
                (Review Level:{' '}
                {project.reviewLevel !== undefined
                  ? project.reviewLevel
                  : 'N/A'}
                )
                {index <
                user.lastEmptyQueueEvent?.currentPrimaryTeamAssignments
                  ?.length -
                  1
                  ? ', '
                  : ''}
              </span>
            )
          )}
        </Typography>
        <Typography>
          Current Secondary Team Assignments:{' '}
          {user.lastEmptyQueueEvent?.currentSecondaryTeamAssignments?.map(
            (project, index) => (
              <span key={index}>
                {idJson[project.projectId]
                  ? idJson[project.projectId]
                  : project.projectName || project.projectId}{' '}
                (Review Level:{' '}
                {project.reviewLevel !== undefined
                  ? project.reviewLevel
                  : 'N/A'}
                )
                {index <
                user.lastEmptyQueueEvent?.currentSecondaryTeamAssignments
                  .length -
                  1
                  ? ', '
                  : ''}
              </span>
            )
          )}
        </Typography>
        <Typography component={'span'}>
          Empty Queue Reasons:
          {Object.entries(user.lastEmptyQueueEvent?.emptyQueueReasons).map(
            ([projectId, reviewLevels]) => (
              <div key={projectId}>
                {idJson[projectId] ? idJson[projectId] : projectId}:
                {Object.entries(reviewLevels).map(([reviewLevel, reason]) => (
                  <div key={reviewLevel}>
                    {reviewLevel}: {reason}
                  </div>
                ))}
              </div>
            )
          )}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Permissions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Allowed Task Types: {user.allowedTaskTypes.join(', ')}
        </Typography>
        <Typography>Is Reviewer: {String(user.isReviewer)}</Typography>
        <Typography>Is Remotask Pro: {String(user.isRemotaskPro)}</Typography>
        <Typography>
          Has Training Feedback Permission:{' '}
          {String(user.hasTrainingFeedbackPermission)}
        </Typography>
        <Typography>
          Force Seon Transaction: {String(user.forceSeonTransaction)}
        </Typography>
        <Typography>
          Persona Verification Course Bypass:{' '}
          {String(user.personaVerificationCourseBypass)}
        </Typography>
        <Typography>
          Reverification Info: {JSON.stringify(user.reverificationInfo)}
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Feature Flags</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Object.entries(user.featureFlags).map(([flag, value], index) => (
          <Typography key={index}>
            {flag}: {String(value)}
          </Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  </div>
);
export default UserProfile;

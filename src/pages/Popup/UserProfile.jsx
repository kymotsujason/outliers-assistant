import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

const UserProfile = ({ user, idJson }) => (
  <div>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Personal Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="The unique identifier for the user"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>ID: {user?.id ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The user's email address"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Email: {user?.email ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The user's first name"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>First Name: {user?.firstName ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The user's last name"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Last Name: {user?.lastName ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The user's phone number"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Phone Number: {user?.phoneNumber ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The country code associated with the user's phone number"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Country Code: {user?.countryCode ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The country code determined from the user's IP address"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            IP Country Code: {user?.ipCountryCode ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The user's age range"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Age Range: {user?.ageRange ?? 'N/A'}</Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Account Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="The type of account the user has"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Account Type: {user?.accountType ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The user's invite code"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Invite Code: {user?.inviteCode ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="Multiplier applied to worker's pay"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Worker Pay Multiplier: {user?.workerPayMultiplier ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The date the account was created"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Created Date:{' '}
            {user?.createdDate
              ? new Date(user.createdDate).toLocaleString()
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The role assigned to the account"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Account Role: {user?.accountRole ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="Is customer review enabled for the user?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Customer Review Enabled:{' '}
            {user?.customerReviewEnabled !== undefined
              ? String(user.customerReviewEnabled)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The user's Google OAuth ID"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Google OAuth ID: {user?.googleOAuthId ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The user's Slack ID for workers"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Worker Slack ID: {user?.workerSlackId ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The user's Scale Discourse ID"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Scale Discourse ID: {user?.scaleDiscourseId ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The current status of the worker"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Worker Status: {user?.workerStatus ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="The account's credit in cents"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Account Credit Cents: {user?.accountCreditCents ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The last time the user was online"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Last Online Datetime:{' '}
            {user?.lastOnlineDatetime
              ? new Date(user.lastOnlineDatetime).toLocaleString()
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The last time the user was active"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Last Active:{' '}
            {user?.lastActive
              ? new Date(user.lastActive).toLocaleString()
              : 'N/A'}
          </Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Project Assignments{' '}
          <Tooltip
            title="If this is empty, check Last Empty Queue Event"
            placement="top-start"
            disableInteractive
            arrow
          >
            <span>
              <InfoIcon />
            </span>
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="The primary projects assigned to the user"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Primary Projects:{' '}
            {user?.tieredAssignedProjects?.primary &&
            user.tieredAssignedProjects.primary.length > 0
              ? user.tieredAssignedProjects.primary.map((project, index) => (
                  <span key={project?.projectId || index}>
                    {idJson[project?.projectId] ??
                      project?.projectName ??
                      project?.projectId ??
                      'Unknown Project'}{' '}
                    (Review Level:{' '}
                    {project?.reviewLevel !== undefined
                      ? project.reviewLevel
                      : 'N/A'}
                    )
                    {index < user.tieredAssignedProjects.primary.length - 1
                      ? ', '
                      : ''}
                  </span>
                ))
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The secondary projects assigned to the user"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Secondary Projects:{' '}
            {user?.tieredAssignedProjects?.secondary &&
            user.tieredAssignedProjects.secondary.length > 0
              ? user.tieredAssignedProjects.secondary.map((project, index) => (
                  <span key={project?.projectId || index}>
                    {idJson[project?.projectId] ??
                      project?.projectName ??
                      project?.projectId ??
                      'Unknown Project'}{' '}
                    (Review Level:{' '}
                    {project?.reviewLevel !== undefined
                      ? project.reviewLevel
                      : 'N/A'}
                    )
                    {index < user.tieredAssignedProjects.secondary.length - 1
                      ? ', '
                      : ''}
                  </span>
                ))
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The tertiary projects assigned to the user"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Tertiary Projects:{' '}
            {user?.tieredAssignedProjects?.tertiary &&
            user.tieredAssignedProjects.tertiary.length > 0
              ? user.tieredAssignedProjects.tertiary.map((project, index) => (
                  <span key={project?.projectId || index}>
                    {idJson[project?.projectId] ??
                      project?.projectName ??
                      project?.projectId ??
                      'Unknown Project'}{' '}
                    (Review Level:{' '}
                    {project?.reviewLevel !== undefined
                      ? project.reviewLevel
                      : 'N/A'}
                    )
                    {index < user.tieredAssignedProjects.tertiary.length - 1
                      ? ', '
                      : ''}
                  </span>
                ))
              : 'None'}
          </Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Permissions and Roles{' '}
          <Tooltip
            title="Team role is your team status, admin means you probably aren't in one"
            placement="top-start"
            disableInteractive
            arrow
          >
            <span>
              <InfoIcon />
            </span>
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="The user's role within the team"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>Team Role: {user?.teamRole ?? 'N/A'}</Typography>
        </Tooltip>
        <Tooltip
          title="Task types the user can edit"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Can Edit Task Types:{' '}
            {Array.isArray(user?.canEditTaskTypes)
              ? user.canEditTaskTypes.join(', ')
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Is the user eligible for training rewards?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Training Rewards Eligible:{' '}
            {user?.trainingRewardsEligible !== undefined
              ? String(user.trainingRewardsEligible)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Required earnings for training rewards eligibility"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Training Rewards Required Earnings:{' '}
            {user?.trainingRewardsRequiredEarnings ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Does the user have access to LiDAR projects?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Can Access Lidar:{' '}
            {user?.canAccessLidar !== undefined
              ? String(user.canAccessLidar)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Has the user's phone number been verified?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Phone Number Verified:{' '}
            {user?.phoneNumberVerified !== undefined
              ? String(user.phoneNumberVerified)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Does the user require onboarding profiling?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Requires Onboarding Profiling:{' '}
            {user?.requiresOnboardingProfiling !== undefined
              ? String(user.requiresOnboardingProfiling)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Has the user completed onboarding profiling?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Onboarding Profiling Completed:{' '}
            {user?.onboardingProfilingCompleted !== undefined
              ? String(user.onboardingProfilingCompleted)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Are the user's worker skills pending after onboarding profiling?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Onboarding Profiling Worker Skills Pending:{' '}
            {user?.onboardingProfilingWorkerSkillsPending !== undefined
              ? String(user.onboardingProfilingWorkerSkillsPending)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Has the user completed the introductory course?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Intro Course Completed:{' '}
            {user?.introCourseCompleted !== undefined
              ? String(user.introCourseCompleted)
              : 'N/A'}
          </Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">
          Last Empty Queue Event{' '}
          <Tooltip
            title="Some common problems (all speculative): NoTasks (Queue is empty), Disabled (Removed from project), WorkerTagsNotMet (In project, but tasks hidden), PausedProject (Project paused), InactiveProject (Project inactive), InvalidWorkerSource (No idea)"
            placement="top-start"
            disableInteractive
            arrow
          >
            <span>
              <InfoIcon />
            </span>
          </Tooltip>{' '}
          <Tooltip
            title="Review Level is your task role: -1 is attempter, 0 is reviewer, 10 is senior reviewer, allReviewLevels or N/A means no role probably"
            placement="top-start"
            disableInteractive
            arrow
          >
            <span>
              <InfoIcon />
            </span>
          </Tooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="The server-side request ID for the last empty queue event"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Server-Side Request ID:{' '}
            {user?.lastEmptyQueueEvent?.serverSideRequestId ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The user ID associated with the event"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            User ID: {user?.lastEmptyQueueEvent?.userId ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The active worker team during the event"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Active Worker Team:{' '}
            {user?.lastEmptyQueueEvent?.activeWorkerTeam ?? 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The time when the task was requested"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Requested At:{' '}
            {user?.lastEmptyQueueEvent?.requestedAt
              ? new Date(user.lastEmptyQueueEvent.requestedAt).toLocaleString()
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The primary team assignments at the time of the event"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Current Primary Team Assignments:{' '}
            {Array.isArray(
              user?.lastEmptyQueueEvent?.currentPrimaryTeamAssignments
            ) &&
            user.lastEmptyQueueEvent.currentPrimaryTeamAssignments.length > 0
              ? user.lastEmptyQueueEvent.currentPrimaryTeamAssignments.map(
                  (project, index) => (
                    <span key={project?.projectId || index}>
                      {idJson[project?.projectId] ??
                        project?.projectName ??
                        project?.projectId ??
                        'Unknown Project'}{' '}
                      (Review Level:{' '}
                      {project?.reviewLevel !== undefined
                        ? project.reviewLevel
                        : 'N/A'}
                      )
                      {index <
                      user.lastEmptyQueueEvent.currentPrimaryTeamAssignments
                        .length -
                        1
                        ? ', '
                        : ''}
                    </span>
                  )
                )
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="The secondary team assignments at the time of the event"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Current Secondary Team Assignments:{' '}
            {Array.isArray(
              user?.lastEmptyQueueEvent?.currentSecondaryTeamAssignments
            ) &&
            user.lastEmptyQueueEvent.currentSecondaryTeamAssignments.length > 0
              ? user.lastEmptyQueueEvent.currentSecondaryTeamAssignments.map(
                  (project, index) => (
                    <span key={project?.projectId || index}>
                      {idJson[project?.projectId] ??
                        project?.projectName ??
                        project?.projectId ??
                        'Unknown Project'}{' '}
                      (Review Level:{' '}
                      {project?.reviewLevel !== undefined
                        ? project.reviewLevel
                        : 'N/A'}
                      )
                      {index <
                      user.lastEmptyQueueEvent.currentSecondaryTeamAssignments
                        .length -
                        1
                        ? ', '
                        : ''}
                    </span>
                  )
                )
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Reasons why the queue was empty for the user"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography component={'span'}>
            Empty Queue Reasons:{' '}
            {user?.lastEmptyQueueEvent?.emptyQueueReasons &&
            Object.keys(user.lastEmptyQueueEvent.emptyQueueReasons).length > 0
              ? Object.entries(user.lastEmptyQueueEvent.emptyQueueReasons).map(
                  ([projectId, reviewLevels]) => (
                    <div key={projectId}>
                      {idJson[projectId] ?? projectId}:
                      {reviewLevels &&
                        Object.entries(reviewLevels).map(
                          ([reviewLevel, reason]) => (
                            <div key={reviewLevel}>
                              {reviewLevel}: {reason ?? 'N/A'}
                            </div>
                          )
                        )}
                    </div>
                  )
                )
              : 'None'}
          </Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Permissions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Tooltip
          title="Task types the user is allowed to access"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Allowed Task Types:{' '}
            {Array.isArray(user?.allowedTaskTypes)
              ? user.allowedTaskTypes.join(', ')
              : 'None'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Is the user a reviewer?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Is Reviewer:{' '}
            {user?.isReviewer !== undefined ? String(user.isReviewer) : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Is the user a Remotask Pro?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Is Remotask Pro:{' '}
            {user?.isRemotaskPro !== undefined
              ? String(user.isRemotaskPro)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Does the user have permission to provide training feedback?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Has Training Feedback Permission:{' '}
            {user?.hasTrainingFeedbackPermission !== undefined
              ? String(user.hasTrainingFeedbackPermission)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Should the user undergo a SEON fraud check?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Force SEON Transaction:{' '}
            {user?.forceSeonTransaction !== undefined
              ? String(user.forceSeonTransaction)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Has the user bypassed Persona verification for the course?"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Persona Verification Course Bypass:{' '}
            {user?.personaVerificationCourseBypass !== undefined
              ? String(user.personaVerificationCourseBypass)
              : 'N/A'}
          </Typography>
        </Tooltip>
        <Tooltip
          title="Information about user's reverification status"
          placement="top-start"
          disableInteractive
          arrow
        >
          <Typography>
            Reverification Info:{' '}
            {user?.reverificationInfo !== undefined
              ? JSON.stringify(user.reverificationInfo)
              : 'N/A'}
          </Typography>
        </Tooltip>
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Feature Flags</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {user?.featureFlags &&
        typeof user.featureFlags === 'object' &&
        Object.keys(user.featureFlags).length > 0 ? (
          Object.entries(user.featureFlags).map(([flag, value], index) => (
            <Tooltip
              key={index}
              title={`Feature flag: ${flag}`}
              placement="top-start"
              disableInteractive
              arrow
            >
              <Typography>
                {flag}: {String(value)}
              </Typography>
            </Tooltip>
          ))
        ) : (
          <Typography>No Feature Flags Available.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  </div>
);

export default UserProfile;

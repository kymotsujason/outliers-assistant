import React from 'react';
import { isRecord, isString, isArray } from '../utils/typeUtils';
import type { TeamAssignment } from '../hooks/useUserData';

interface TeamAssignmentListProps {
  assignments: TeamAssignment;
  idJson: Record<string, string>;
}

const TeamAssignmentList: React.FC<TeamAssignmentListProps> = React.memo(({ assignments, idJson }) => {
  if (!assignments) return <>None</>;

  // Handle array-style assignments
  if (isArray(assignments)) {
    if (assignments.length === 0) return <>None</>;

    return (
      <>
        {assignments.map((project, index) => {
          if (!isRecord(project)) return null;
          const projectId = isString(project.projectId) ? project.projectId : undefined;
          const projectName = isString(project.projectName) ? project.projectName : undefined;
          const reviewLevel = project.reviewLevel;

          return (
            <span key={projectId || index}>
              {projectId && idJson[projectId] ? idJson[projectId] : projectName || projectId || 'Unknown Project'}{' '}
              (Review Level: {reviewLevel !== undefined ? String(reviewLevel) : 'N/A'})
              {index < assignments.length - 1 ? ', ' : ''}
            </span>
          );
        })}
      </>
    );
  }

  // Handle object-style assignments (key-value pairs)
  if (isRecord(assignments)) {
    if (Object.keys(assignments).length === 0) return <>None</>;

    const entries = Object.entries(assignments);

    return (
      <>
        {entries.map(([key, project], index) => {
          if (!isRecord(project)) return null;
          const projectId = isString(project.projectId) ? project.projectId : key;
          const projectName = isString(project.projectName) ? project.projectName : 'Unknown Project';
          const reviewLevel = project.reviewLevel;

          return (
            <span key={projectId || index}>
              {projectId && idJson[projectId] ? idJson[projectId] : projectName || projectId} (Review Level:{' '}
              {reviewLevel !== undefined ? String(reviewLevel) : 'N/A'}){index < entries.length - 1 ? ', ' : ''}
            </span>
          );
        })}
      </>
    );
  }

  return <>None</>;
});

export default TeamAssignmentList;

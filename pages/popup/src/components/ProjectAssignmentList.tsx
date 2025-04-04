import React from 'react';
import type { ProjectAssignment } from '../hooks/useUserData';

interface ProjectAssignmentListProps {
  projects: ProjectAssignment[];
  idJson: Record<string, string>;
}

const ProjectAssignmentList: React.FC<ProjectAssignmentListProps> = React.memo(({ projects, idJson }) => {
  if (!projects || projects.length === 0) return <>None</>;

  return (
    <>
      {projects.map((project, index) => {
        const projectId = project.projectId;
        const projectName = project.projectName;
        const reviewLevel = project.reviewLevel;

        return (
          <span key={projectId || index}>
            {projectId && idJson[projectId] ? idJson[projectId] : projectName || projectId || 'Unknown Project'} (Review
            Level: {reviewLevel !== undefined ? String(reviewLevel) : 'N/A'}){index < projects.length - 1 ? ', ' : ''}
          </span>
        );
      })}
    </>
  );
});

export default ProjectAssignmentList;

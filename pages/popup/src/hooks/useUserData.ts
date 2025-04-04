import { useMemo } from 'react';
import { isRecord, isString, isArray, isNumber, safeDate } from '../utils/typeUtils';

// New interface for project layer assignments
export interface ProjectLayerAssignment {
  projectId: string;
  isChosen: boolean;
  expiresAt?: string; // Store as ISO string or formatted date string
  status?: string; // Add status field
}

export interface UserData {
  // Basic info
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // and other potential fields...
}

// Define specific types for team assignments
export type TeamAssignmentArray = Array<{
  projectId?: string;
  projectName?: string;
  reviewLevel?: number | string;
  [key: string]: unknown;
}>;

export type TeamAssignmentRecord = Record<
  string,
  {
    projectId?: string;
    projectName?: string;
    reviewLevel?: number | string;
    [key: string]: unknown;
  }
>;

export type TeamAssignment = TeamAssignmentArray | TeamAssignmentRecord | null;

interface UseUserDataReturn {
  userData: Record<string, unknown>;
  getProjectLayerAssignments: () => ProjectLayerAssignment[]; // Updated function
  getEmptyQueueData: () => Record<string, unknown> | null;
  getTeamAssignments: (type: 'currentPrimaryTeamAssignments' | 'currentSecondaryTeamAssignments') => TeamAssignment;
  getFeatureFlags: () => Record<string, unknown> | null;
}

export const useUserData = (user: unknown): UseUserDataReturn => {
  // Cast user to Record<string, unknown> for easier property access
  const userData = useMemo(() => (isRecord(user) ? user : {}), [user]);

  // Helper to safely get empty queue data (Moved before getProjectLayerAssignments)
  const getEmptyQueueData = useMemo(() => {
    return (): Record<string, unknown> | null => {
      const lastEmptyQueueEvent = userData?.lastEmptyQueueEvent;
      return isRecord(lastEmptyQueueEvent) ? lastEmptyQueueEvent : null;
    };
  }, [userData]);

  // New helper to get project layer assignments
  const getProjectLayerAssignments = useMemo(() => {
    return (): ProjectLayerAssignment[] => {
      const assignedLayers = userData?.assignedProjectLayers;
      const chosenLayer = userData?.chosenProjectLayer;
      const chosenProjectId = isRecord(chosenLayer) && isString(chosenLayer.projectId) ? chosenLayer.projectId : null;
      const emptyQueueData = getEmptyQueueData(); // Get empty queue data for status lookup
      const emptyQueueReasons = isRecord(emptyQueueData?.emptyQueueReasons) ? emptyQueueData.emptyQueueReasons : null;

      // Helper function to find the relevant status
      const findProjectStatus = (projectId: string): string | undefined => {
        if (!emptyQueueReasons || !isRecord(emptyQueueReasons[projectId])) {
          return undefined;
        }
        const projectReasons = emptyQueueReasons[projectId] as Record<string, unknown>;
        for (const key in projectReasons) {
          const status = projectReasons[key];
          if (isString(status) && status !== 'NoPermissionsAtReviewLevel') {
            return status; // Return the first relevant status found
          }
        }
        return undefined; // No relevant status found
      };

      const layers: ProjectLayerAssignment[] = [];
      const processedIds = new Set<string>();

      // Process assigned layers
      if (isArray(assignedLayers)) {
        assignedLayers.forEach(layer => {
          if (isRecord(layer) && isString(layer.projectId)) {
            const projectId = layer.projectId;
            if (!processedIds.has(projectId)) {
              layers.push({
                projectId: projectId,
                isChosen: projectId === chosenProjectId,
                expiresAt: isString(layer.expiresAt) ? safeDate(layer.expiresAt) : undefined,
                status: findProjectStatus(projectId), // Add status lookup
              });
              processedIds.add(projectId);
            }
          }
        });
      }

      // Ensure chosen layer is included if not already present
      if (chosenProjectId && !processedIds.has(chosenProjectId)) {
        layers.push({
          projectId: chosenProjectId,
          isChosen: true,
          expiresAt: undefined, // Chosen layer doesn't have expiry in the main object
          status: findProjectStatus(chosenProjectId), // Add status lookup
        });
      }

      // Sort chosen layer to the top, then by expiry date (if available), then by ID
      layers.sort((a, b) => {
        if (a.isChosen !== b.isChosen) return a.isChosen ? -1 : 1;
        // Optional: Sort by expiry date if needed, otherwise sort by ID
        // if (a.expiresAt && b.expiresAt) return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        // if (a.expiresAt) return -1;
        // if (b.expiresAt) return 1;
        return a.projectId.localeCompare(b.projectId);
      });

      return layers;
    };
  }, [userData, getEmptyQueueData]); // Keep getEmptyQueueData dependency

  // Helper to safely access team assignments from empty queue event
  const getTeamAssignments = useMemo(() => {
    return (type: 'currentPrimaryTeamAssignments' | 'currentSecondaryTeamAssignments'): TeamAssignment => {
      const emptyQueueData = getEmptyQueueData();
      if (!emptyQueueData) return null;

      const assignments = emptyQueueData[type];

      // If no assignments found, return null
      if (assignments === undefined) return null;

      // Handle array type assignments
      if (isArray(assignments)) {
        // Return null if the array is empty
        if (assignments.length === 0) return null;

        return assignments.filter(isRecord).map(project => ({
          projectId: isString(project.projectId) ? project.projectId : undefined,
          projectName: isString(project.projectName) ? project.projectName : undefined,
          reviewLevel: isNumber(project.reviewLevel) || isString(project.reviewLevel) ? project.reviewLevel : undefined,
          ...project, // Keep other properties
        }));
      }

      // Handle record type assignments
      if (isRecord(assignments)) {
        // Return null if no keys
        if (Object.keys(assignments).length === 0) return null;

        const result: TeamAssignmentRecord = {};
        Object.entries(assignments).forEach(([key, project]) => {
          if (isRecord(project)) {
            result[key] = {
              projectId: isString(project.projectId) ? project.projectId : undefined,
              projectName: isString(project.projectName) ? project.projectName : undefined,
              reviewLevel:
                isNumber(project.reviewLevel) || isString(project.reviewLevel) ? project.reviewLevel : undefined,
              ...project, // Keep other properties
            };
          }
        });
        return Object.keys(result).length > 0 ? result : null;
      }

      return null;
    };
  }, [getEmptyQueueData]);

  // Helper to safely get feature flags
  const getFeatureFlags = useMemo(() => {
    return (): Record<string, unknown> | null => {
      const featureFlags = userData?.featureFlags;
      return isRecord(featureFlags) ? featureFlags : null;
    };
  }, [userData]);

  return {
    userData,
    getProjectLayerAssignments, // Updated return value
    getEmptyQueueData,
    getTeamAssignments,
    getFeatureFlags,
  };
};

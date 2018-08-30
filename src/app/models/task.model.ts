export interface TaskData {
  taskName: string;
  taskDescription: string;
  taskAssignedToProject: string;
  taskAssignedToProjectName: string;
  taskAssignedToProjectType: string;
  taskStatus: string;
  taskDone: boolean;
  taskPriority: string;
  taskNotes: Array<string>;
  taskID: string;
}

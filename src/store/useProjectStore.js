import { create } from 'zustand';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';

const useProjectStore = create((set) => ({
  currentProject: null,
  members: [],
  currentUserRole: 'VIEWER',
  isLoading: false,
  error: null,
  unitProcesses: [],
  projectOptions: {
    projectId: 0,
    unitCost: 0,
    teamSize: 0,
    cocomoType: 'ORGANIC',
    projectLanguageList: [],
  },

  setMembers: (members) => {
    const userEmail = useAuthStore.getState().user;
    const currentUserRole =
      members.find((member) => member.email === userEmail)?.role || 'VIEWER';
    set({ members, currentUserRole });
  },

  fetchProjectData: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const membersResponse = await api.get(`/projects/${projectId}/users`);
      const membersList = membersResponse.data.responseData.members;

      const projectResponse = await api.get(`/projects/${projectId}`);
      const projectData = projectResponse.data.responseData;

      const optionsResponse = await api.get(`/projects/${projectId}/options`);
      const optionsData = optionsResponse.data.responseData;

      const userEmail = useAuthStore.getState().user;
      const currentUserRole =
        membersList.find((member) => member.email === userEmail)?.role ||
        'VIEWER';

      set({
        members: membersList,
        currentProject: projectData,
        currentUserRole,
        projectOptions: optionsData,
        error: null,
      });

      return {
        members: membersList,
        project: projectData,
        options: optionsData,
      };
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProjectOptions: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/projects/${projectId}/options`);
      const optionsData = response.data.responseData;
      const transformedData = {
        ...optionsData,
        projectLanguageList: optionsData.languageList || [],
      };
      set({ projectOptions: transformedData, error: null });
      return transformedData;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProjectOptions: async (projectId, options) => {
    set({ isLoading: true, error: null });
    try {
      const requestData = {
        unitCost: options.unitCost,
        teamSize: options.teamSize,
        cocomoType: options.cocomoType,
        languageList: options.projectLanguageList,
      };

      const response = await api.post(
        `/projects/${projectId}/options`,
        requestData,
      );
      const updatedOptions = response.data.responseData;
      const transformedData = {
        ...updatedOptions,
        projectLanguageList: updatedOptions.languageList || [],
      };
      set({ projectOptions: transformedData, error: null });
      return transformedData;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnitProcesses: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/projects/${projectId}/unit-processes`, {
        params: {
          versionNumber: '1.0',
        },
      });
      const unitProcesses = response.data.responseData;
      set({ unitProcesses, error: null });
      return unitProcesses;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useProjectStore;

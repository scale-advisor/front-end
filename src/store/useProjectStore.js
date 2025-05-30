import { create } from 'zustand';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';

const useProjectStore = create((set) => ({
  currentProject: null,
  members: [],
  currentUserRole: 'VIEWER',
  isLoading: false,
  error: null,
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

      const userEmail = useAuthStore.getState().user;
      const currentUserRole =
        membersList.find((member) => member.email === userEmail)?.role ||
        'VIEWER';

      set({
        members: membersList,
        currentProject: projectData,
        currentUserRole,
        error: null,
      });

      return { members: membersList, project: projectData };
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useProjectStore;

import { create } from 'zustand';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';

const useProjectStore = create((set) => ({
  currentProject: null,
  currentVersion: null,
  members: [],
  currentUserRole: 'VIEWER',
  isLoading: false,
  error: null,
  unitProcesses: [],
  requirements: [],
  projectOptions: {
    projectId: 0,
    unitCost: 0,
    teamSize: 0,
    cocomoType: 'ORGANIC',
    projectLanguageList: [],
  },
  adjustmentFactors: [],

  setCurrentProject: (project) => set({ currentProject: project }),

  setMembers: (members) => {
    set({ members });
  },

  fetchProjectData: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const membersResponse = await api.get(`/projects/${projectId}/users`);
      const membersList = membersResponse.data.responseData.members;

      const projectResponse = await api.get(`/projects/${projectId}`);
      const projectData = projectResponse.data.responseData;

      // 가장 최신 버전 가져오기
      const latestVersion =
        projectData.versionList[projectData.versionList.length - 1];

      const optionsResponse = await api.get(`/projects/${projectId}/options`);
      const optionsData = optionsResponse.data.responseData;

      const adjustmentFactorsResponse = await api.get(
        `/projects/${projectId}/adjustment-factors`,
        {
          params: {
            versionNumber: latestVersion,
          },
        },
      );
      const adjustmentFactorsData =
        adjustmentFactorsResponse.data.responseData.adjustmentFactorList || [];

      // 요구사항과 단위프로세스도 최신 버전으로 가져오기
      const requirementsResponse = await api.get(
        `/projects/${projectId}/requirements`,
        {
          params: {
            versionNumber: latestVersion,
          },
        },
      );
      const requirementsData = requirementsResponse.data.responseData;

      const unitProcessesResponse = await api.get(
        `/projects/${projectId}/unit-processes`,
        {
          params: {
            versionNumber: latestVersion,
          },
        },
      );
      const unitProcessesData = unitProcessesResponse.data.responseData;

      const userEmail = useAuthStore.getState().email;

      const currentUserRole =
        membersList.find((member) => member.email === userEmail)?.role ||
        'VIEWER';
      console.log('현재 사용자 역할:', currentUserRole);
      set({
        members: membersList,
        currentProject: projectData,
        currentVersion: latestVersion,
        currentUserRole,
        projectOptions: optionsData,
        adjustmentFactors: adjustmentFactorsData,
        requirements: requirementsData,
        unitProcesses: unitProcessesData,
        error: null,
      });

      return {
        members: membersList,
        project: projectData,
        options: optionsData,
        adjustmentFactors: adjustmentFactorsData,
        requirements: requirementsData,
        unitProcesses: unitProcessesData,
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

  updateProjectOptions: async (projectId, options, adjustmentFactors) => {
    set({ isLoading: true, error: null });
    try {
      // 옵션 데이터 업데이트
      const optionsData = {
        unitCost: options.unitCost,
        teamSize: options.teamSize,
        cocomoModel: options.cocomoModel,
        projectLanguageList: options.languageList,
        scaleFactors: options.scaleFactors,
        costDrivers: options.costDrivers,
      };

      // 보정계수 데이터 업데이트
      const adjustmentFactorsData = {
        adjustmentFactorList: adjustmentFactors.map((factor) => ({
          adjustmentFactorId: factor.adjustmentFactorId,
          level: factor.adjustmentFactorLevel,
        })),
      };

      console.log('옵션 데이터:', optionsData);
      console.log('보정계수 데이터:', adjustmentFactorsData);

      // 옵션 업데이트
      const optionsResponse = await api.patch(
        `/projects/${projectId}/options`,
        optionsData,
      );

      console.log('옵션 응답:', optionsResponse.data);

      // 보정계수 업데이트
      const adjustmentFactorsResponse = await api.put(
        `/projects/${projectId}/adjustment-factors`,
        adjustmentFactorsData,
      );

      console.log('보정계수 응답:', adjustmentFactorsResponse.data);

      const updatedOptions = optionsResponse.data?.responseData || options;
      const updatedAdjustmentFactors =
        adjustmentFactorsResponse.data?.responseData?.adjustmentFactorList ||
        adjustmentFactorsResponse.data?.adjustmentFactorList ||
        adjustmentFactors;

      set({
        projectOptions: {
          ...updatedOptions,
          projectLanguageList:
            updatedOptions?.languageList || options.languageList || [],
        },
        adjustmentFactors: updatedAdjustmentFactors,
        error: null,
      });

      return {
        options: updatedOptions,
        adjustmentFactors: updatedAdjustmentFactors,
      };
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnitProcesses: async (projectId, versionNumber) => {
    set({ isLoading: true, error: null });
    try {
      // 버전이 지정되지 않은 경우 현재 프로젝트의 최신 버전 사용
      const currentState = useProjectStore.getState();
      const currentVersion =
        versionNumber ||
        currentState.currentProject?.versionList[
          currentState.currentProject.versionList.length - 1
        ];

      const response = await api.get(`/projects/${projectId}/unit-processes`, {
        params: {
          versionNumber: currentVersion,
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

  fetchRequirements: async (projectId, versionNumber) => {
    set({ isLoading: true, error: null });
    try {
      // 버전이 지정되지 않은 경우 현재 프로젝트의 최신 버전 사용
      const currentState = useProjectStore.getState();
      const currentVersion =
        versionNumber ||
        currentState.currentProject?.versionList[
          currentState.currentProject.versionList.length - 1
        ];

      const response = await api.get(`/projects/${projectId}/requirements`, {
        params: {
          versionNumber: currentVersion,
        },
      });
      const requirements = response.data.responseData;
      set({ requirements, error: null });
      return requirements;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // 특정 버전의 데이터를 불러오는 함수
  loadVersion: async (projectId, versionNumber) => {
    set({ isLoading: true, error: null });
    try {
      // 보정계수, 요구사항, 단위프로세스 데이터를 해당 버전으로 불러오기
      const [
        adjustmentFactorsResponse,
        requirementsResponse,
        unitProcessesResponse,
      ] = await Promise.all([
        api.get(`/projects/${projectId}/adjustment-factors`, {
          params: { versionNumber },
        }),
        api.get(`/projects/${projectId}/requirements`, {
          params: { versionNumber },
        }),
        api.get(`/projects/${projectId}/unit-processes`, {
          params: { versionNumber },
        }),
      ]);

      const adjustmentFactorsData =
        adjustmentFactorsResponse.data.responseData.adjustmentFactorList || [];
      const requirementsData = requirementsResponse.data.responseData;
      const unitProcessesData = unitProcessesResponse.data.responseData;

      set({
        adjustmentFactors: adjustmentFactorsData,
        requirements: requirementsData,
        unitProcesses: unitProcessesData,
        currentVersion: versionNumber,
        error: null,
      });

      return {
        adjustmentFactors: adjustmentFactorsData,
        requirements: requirementsData,
        unitProcesses: unitProcessesData,
      };
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useProjectStore;

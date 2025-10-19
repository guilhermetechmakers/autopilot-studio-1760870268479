// React Query hooks for Intake functionality

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { intakeApi } from '@/api/intake';
import type {
  CreateIntakeInput,
  UpdateIntakeInput,
  IntakeAIRequest,
  GenerateProposalFromIntakeInput,
  ScheduleDiscoveryInput,
} from '@/types/intake';

export function useIntakes() {
  return useQuery({
    queryKey: ['intakes'],
    queryFn: intakeApi.getAll,
  });
}

export function useIntake(id: string | null) {
  return useQuery({
    queryKey: ['intake', id],
    queryFn: () => intakeApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateIntake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateIntakeInput) => intakeApi.create(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['intake', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
    },
  });
}

export function useUpdateIntake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: UpdateIntakeInput) => intakeApi.update(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['intake', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
    },
  });
}

export function useIntakeAI() {
  return useMutation({
    mutationFn: (request: IntakeAIRequest) => intakeApi.getAIAssistance(request),
  });
}

export function useQualifyIntake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => intakeApi.qualify(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['intake', id] });
    },
  });
}

export function useGenerateProposal() {
  return useMutation({
    mutationFn: (input: GenerateProposalFromIntakeInput) => intakeApi.generateProposal(input),
  });
}

export function useScheduleDiscovery() {
  return useMutation({
    mutationFn: (input: ScheduleDiscoveryInput) => intakeApi.scheduleDiscovery(input),
  });
}

export function useUploadIntakeFile() {
  return useMutation({
    mutationFn: ({ file, intakeId }: { file: File; intakeId: string }) =>
      intakeApi.uploadFile(file, intakeId),
  });
}

export function useDeleteIntake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => intakeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
    },
  });
}

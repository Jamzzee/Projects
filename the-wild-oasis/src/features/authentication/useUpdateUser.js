import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser as updateCurrentUserApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUserApi,
    // eslint-disable-next-line no-unused-vars
    onSuccess: ({ user }) => {
      toast.success('User account successfully updated'),
        // Update query in the cache directly set a new updating user in the react query cache
        queryClient.setQueryData(['user'], user);

      // queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: err => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}

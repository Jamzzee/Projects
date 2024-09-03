import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear cache after logout
      queryClient.removeQueries();
      navigate('/login', { replace: true });
    },
    onError: () => toast.error(`Something gonna wrong`),
  });

  return { logout, isLoading };
}

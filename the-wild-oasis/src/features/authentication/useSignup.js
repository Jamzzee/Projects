import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../../services/apiAuth';

export function useSignup() {
  const navigate = useNavigate();

  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: user => {
      console.log(user);
      toast.success(
        "Account successfully created. Please verify the new account from the user's email address"
      );
      navigate('/dashboard', { replace: true });
    },
    onError: err => toast.error(`Something gonna wrong: ${err.message}`),
  });

  return { signup, isLoading };
}

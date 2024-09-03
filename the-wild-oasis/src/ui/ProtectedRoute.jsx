/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';

import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  // 1. Load the authenticated user
  const { isLoading, isAuthenticated, fetchStatus } = useUser();

  // 3. If there is NO authenticated user, reditect to the /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading && fetchStatus !== 'fetching')
      navigate('/login');
  }, [isAuthenticated, navigate, isLoading, fetchStatus]);

  // 2. While laoding, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. If there IS a user, render the app

  if (isAuthenticated) return children;
}

export default ProtectedRoute;

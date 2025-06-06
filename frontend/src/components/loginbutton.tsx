import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function LoginButton() {
  const {
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  return !isAuthenticated && (
     <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600" onClick={() => loginWithRedirect()}>Log in</button>
  );
}

export default LoginButton;
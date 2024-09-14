'use server';
import { cookies } from 'next/headers';

export default async function SignUpLogIn(email: string, password: string, firstName: string, lastName: string) {
  const loginData = { email, password };
  const signupData = { first_name: firstName, last_name: lastName, email, password, re_password: password };

  try {
    // Attempt to log in
    const loginResponse = await fetch(`${process.env.API_BACKEND}/auth/jwt/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (loginResponse.status === 200) {
      const { access, refresh } = await loginResponse.json();
      cookies().set('access', access);
      cookies().set('refresh', refresh);
      return { success: true, message: 'Logged in successfully' };
    } else if (loginResponse.status === 401) {
      // If login fails, attempt to sign up
      const signupResponse = await fetch(`${process.env.API_BACKEND}/auth/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      if (signupResponse.status === 201) {
        // If signup is successful, attempt to log in again
        const newLoginResponse = await fetch(`${process.env.API_BACKEND}/auth/jwt/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });

        if (newLoginResponse.status === 200) {
          const { access, refresh } = await newLoginResponse.json();
          cookies().set('access', access);
          cookies().set('refresh', refresh);
          return { success: true, message: 'Signed up and logged in successfully' };
        } else {
          return { success: false, message: 'Signed up but failed to log in' };
        }
      } else {
        return { success: false, message: 'Failed to sign up' };
      }
    } else {
      return { success: false, message: 'Unexpected error occurred' };
    }
  } catch (error) {
    console.error('Error in SignUpLogIn:', error);
    return { success: false, message: 'An error occurred during the process' };
  }
}
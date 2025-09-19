import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { extractError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [serverErr, setServerErr] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      const { data } = await api.post('/auth/login', values);
      login(data.token);
      const to = loc.state?.from || '/';
      nav(to, { replace: true });
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Sign in">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Email" error={errors.email?.message} {...register('email')} />
        <TextInput label="Password" type="password" error={errors.password?.message} {...register('password')} />
        <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>Login</button>
      </form>
      {serverErr && <pre style={{color:'crimson', marginTop:8}}>{serverErr.message}</pre>}
      <div style={{marginTop:12, fontSize:14}}>
        <Link to="/forgot">Forgot password?</Link>
      </div>
      <div style={{marginTop:6, fontSize:14}}>
        No account? <Link to="/register">Register</Link>
      </div>
    </AuthCard>
  );
}

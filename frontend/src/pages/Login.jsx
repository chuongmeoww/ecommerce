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

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      // BE trả { user, token }
      const { data } = await api.post('/auth/login', values);

      // ✅ Lưu localStorage để api interceptor đọc gắn Authorization
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', JSON.stringify({ user: data.user, token: data.token }));

      // ✅ Cập nhật context (nếu context bạn dùng token)
      login(data.token);

      // Điều hướng về trang trước hoặc home
      const to = loc.state?.from?.pathname || loc.state?.from || '/';
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
        <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { extractError } from '../services/api';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function Forgot() {
  const nav = useNavigate();
  const [serverErr, setServerErr] = useState(null);
  const [result, setResult] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerErr(null); setResult(null);
    try {
      const { data } = await api.post('/auth/forgot-password', values);
      // Nếu là DEV, backend trả token/resetUrl → điều hướng luôn sang /reset
      if (data?.dev?.token) {
        nav(`/reset?token=${encodeURIComponent(data.dev.token)}`, { replace: true });
        return;
      }
      if (data?.dev?.resetUrl) {
        // Phòng trường hợp chỉ có resetUrl:
        try {
          const u = new URL(data.dev.resetUrl);
          // nếu cùng domain FE thì giữ SPA navigation
          if (u.origin === window.location.origin) {
            nav(`${u.pathname}${u.search}`, { replace: true });
          } else {
            window.location.assign(data.dev.resetUrl);
          }
          return;
        } catch {
          window.location.assign(data.dev.resetUrl);
          return;
        }
      }
      // PROD (không có dev token): chỉ hiện message
      setResult(data);
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Forgot password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Email" error={errors.email?.message} {...register('email')} />
        <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>Send reset link</button>
      </form>

      {result && <div style={{marginTop:8, color:'green'}}>{result.message}</div>}
      {serverErr && <pre style={{color:'crimson', marginTop:8}}>{serverErr.message}</pre>}
    </AuthCard>
  );
}

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { extractError } from '../services/api';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { useState } from 'react';

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export default function ChangePassword() {
  const [serverMsg, setServerMsg] = useState('');
  const [serverErr, setServerErr] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerErr(null); setServerMsg('');
    try {
      const { data } = await api.post('/auth/change-password', values);
      setServerMsg(data.message);
      reset();
    } catch (e) {
      setServerErr(extractError(e));
    }
  };

  return (
    <AuthCard title="Change password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Current password" type="password" error={errors.currentPassword?.message} {...register('currentPassword')} />
        <TextInput label="New password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
        <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>Change</button>
      </form>
      {serverMsg && <div style={{color:'green', marginTop:8}}>{serverMsg}</div>}
      {serverErr && <pre style={{color:'crimson', marginTop:8}}>{serverErr.message}</pre>}
    </AuthCard>
  );
}

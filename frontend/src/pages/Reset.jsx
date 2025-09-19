import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api, { extractError } from '../services/api';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  token: z.string().min(10, 'Invalid token'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Reset() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const [serverErr, setServerErr] = useState(null);

  // Lấy token từ URL (nếu có) làm mặc định cho form
  const tokenFromQuery = params.get('token') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: tokenFromQuery, newPassword: '' },
  });

  // Nếu URL thay đổi (ít gặp), cập nhật lại token cho form
  useEffect(() => {
    const t = params.get('token');
    if (t) setValue('token', t, { shouldValidate: true });
  }, [params, setValue]);

  const onSubmit = async (values) => {
    setServerErr(null);
    try {
      const { data } = await api.post('/auth/reset-password', values);
      login(data.token);        // lưu JWT vào context/localStorage
      nav('/');                 // về Home
    } catch (e) {
      setServerErr(extractError(e)); // { code, message, details? }
    }
  };

  return (
    <AuthCard title="Reset password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Token"
          error={errors.token?.message}
          readOnly={!!tokenFromQuery}            // có token từ URL thì khóa ô này
          {...register('token')}
        />
        <TextInput
          label="New password"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <button disabled={isSubmitting} style={{ width: '100%', padding: '10px 12px' }}>
          Reset
        </button>
      </form>

      {serverErr && (
        <div style={{ marginTop: 8 }}>
          <pre style={{ color: 'crimson' }}>{serverErr.message}</pre>
          {serverErr.code === 'INVALID_TOKEN' && (
            <div style={{ marginTop: 6 }}>
              Link hết hạn/không hợp lệ? <Link to="/forgot">Gửi lại reset link</Link>
            </div>
          )}
        </div>
      )}
    </AuthCard>
  );
}

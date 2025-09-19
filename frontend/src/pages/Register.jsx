import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api, { extractError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import TextInput from '../components/TextInput';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/register', values);
      login(data.token);
      nav('/');
    } catch (e) {
      throw extractError(e);
    }
  };

  return (
    <AuthCard title="Create account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Name" error={errors.name?.message} {...register('name')} />
        <TextInput label="Email" error={errors.email?.message} {...register('email')} />
        <TextInput label="Password" type="password" error={errors.password?.message} {...register('password')} />
        <button disabled={isSubmitting} style={{width:'100%', padding:'10px 12px'}}>Register</button>
      </form>
      <div style={{marginTop:12, fontSize:14}}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </AuthCard>
  );
}

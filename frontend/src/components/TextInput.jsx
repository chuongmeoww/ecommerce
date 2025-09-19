export default function TextInput({ label, error, ...props }) {
  return (
    <div style={{marginBottom:12}}>
      <label style={{display:'block', fontSize:13, marginBottom:6}}>{label}</label>
      <input {...props} style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #ddd'}} />
      {error && <div style={{color:'crimson', fontSize:12, marginTop:6}}>{error}</div>}
    </div>
  );
}

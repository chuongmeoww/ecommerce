export default function AuthCard({ title, children }) {
  return (
    <div style={{maxWidth:420, margin:'24px auto', padding:24, border:'1px solid #eee', borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,.04)'}}>
      <h2 style={{marginTop:0}}>{title}</h2>
      {children}
    </div>
  );
}

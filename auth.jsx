function AuthScreen({ mode, setMode, onSubmit, loading, message }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const isSignup = mode === 'signup';
  const valid = email.includes('@') && password.length >= 6;

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '22px 20px 120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: CT.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: CT.green,
        }}>{Icons.ball}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: CT.ink }}>CourtTrack</div>
          <div style={{ fontSize: 12, color: CT.ink3, marginTop: 1 }}>MVP para coaches de pádel</div>
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 750, color: CT.ink, lineHeight: 1.08, letterSpacing: 0 }}>
        {isSignup ? 'Crea tu cuenta' : 'Entra a tu cuenta'}
      </div>
      <div style={{ marginTop: 8, fontSize: 14, color: CT.ink3, lineHeight: 1.5 }}>
        Tus alumnos, clases y progresos quedan guardados para volver cuando quieras.
      </div>

      {message?.text && (
        <Notice tone={message.type} style={{ marginTop: 18 }}>{message.text}</Notice>
      )}

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label>Email</Label>
          <TextInput value={email} onChange={setEmail} placeholder="coach@mail.com" type="email" />
        </div>
        <div>
          <Label>Contraseña</Label>
          <TextInput value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" type="password" />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32 }}>
        <PrimaryButton
          disabled={!valid || loading}
          onClick={() => onSubmit(email.trim(), password)}
        >
          {loading ? 'Guardando...' : isSignup ? 'Crear cuenta' : 'Iniciar sesión'}
        </PrimaryButton>
        <button onClick={() => setMode(isSignup ? 'login' : 'signup')} style={{
          width: '100%', height: 44, marginTop: 10, border: 'none', background: 'transparent',
          color: CT.ink2, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          {isSignup ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen });

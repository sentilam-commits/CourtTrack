// Coach Dashboard + Add Student

function Dashboard({ students, nav, user, onLogout, message, profile }) {
  const [q, setQ] = React.useState('');
  const [showMenu, setShowMenu] = React.useState(false);
  const [noStudentHint, setNoStudentHint] = React.useState(false);

  const filtered = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = students.filter(s => s.classes[0]?.date === today).length;

  const todayLabel = (() => {
    const d = new Date();
    const w = d.toLocaleDateString('es-ES', { weekday: 'long' });
    const dm = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    return `${w.charAt(0).toUpperCase() + w.slice(1)}, ${dm}`;
  })();

  const greeting = profile?.firstName ? `Hola, ${profile.firstName}` : 'Hola';
  const initials = profile?.firstName && profile?.lastName
    ? (profile.firstName[0] + profile.lastName[0]).toUpperCase()
    : (user?.email || 'CT').slice(0, 2).toUpperCase();

  const handleRegistrarClase = () => {
    if (students.length === 0) {
      setNoStudentHint(true);
      setTimeout(() => setNoStudentHint(false), 3000);
    } else {
      nav('pickStudent');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 13, color: CT.ink3, fontWeight: 500 }}>{todayLabel}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: CT.ink, letterSpacing: 0, marginTop: 2 }}>
              {greeting}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(m => !m)} title={user?.email || ''} style={{
              width: 44, height: 44, borderRadius: 999, border: 'none',
              background: CT.greenSoft, color: CT.greenDeep, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
            }}>{initials}</button>
            {showMenu && (
              <>
                <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <div style={{
                  position: 'absolute', right: 0, top: 52, zIndex: 50,
                  background: '#fff', borderRadius: 14,
                  border: `1px solid ${CT.line}`,
                  boxShadow: '0 12px 32px rgba(14,19,17,0.12)',
                  minWidth: 180, overflow: 'hidden',
                }}>
                  <button onClick={() => { setShowMenu(false); nav('editProfile'); }} style={{
                    width: '100%', padding: '14px 16px', border: 'none', background: 'transparent',
                    textAlign: 'left', fontSize: 14, fontWeight: 500, color: CT.ink,
                    fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    {Icons.user} Mi perfil
                  </button>
                  <div style={{ height: 1, background: CT.line }} />
                  <button onClick={() => { setShowMenu(false); onLogout(); }} style={{
                    width: '100%', padding: '14px 16px', border: 'none', background: 'transparent',
                    textAlign: 'left', fontSize: 14, fontWeight: 500, color: CT.danger,
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
          <StatCard k={students.length} label="Alumnos" />
          <StatCard k={todayCount} label="Clases hoy" accent />
          <StatCard k={students.reduce((a,s)=>a+s.classes.length,0)} label="Registros" />
        </div>
      </div>

      {message?.text && (
        <div style={{ padding: '0 20px 12px' }}>
          <Notice tone={message.type}>{message.text}</Notice>
        </div>
      )}

      {/* Search — only shown when students exist */}
      {students.length > 0 && (
        <div style={{ padding: '4px 20px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 46, padding: '0 14px', borderRadius: 14,
            background: CT.card, border: `1px solid ${CT.line}`,
          }}>
            <span style={{ color: CT.ink4 }}>{Icons.search}</span>
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar alumnos"
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none',
                       fontSize: 15, fontFamily: 'inherit', color: CT.ink }} />
          </div>
        </div>
      )}

      {/* Students */}
      <div style={{ padding: '6px 20px 0' }}>
        <SectionLabel>Alumnos</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(s => <StudentRow key={s.id} s={s} onClick={() => nav('profile', s.id)} />)}
          {students.length === 0 && (
            <div style={{ padding: '28px 24px', borderRadius: 18, background: CT.card, textAlign: 'center' }}>
              <div style={{ color: CT.ink2, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                Empieza agregando tu primer alumno.
              </div>
              <div style={{ color: CT.ink3, fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                Después podrás registrar clases, tareas y progreso semanal.
              </div>
              <button onClick={() => nav('addStudent')} style={{
                height: 44, padding: '0 20px', borderRadius: 12,
                background: CT.ink, color: '#fff', fontSize: 14, fontWeight: 600,
                border: 'none', fontFamily: 'inherit', cursor: 'pointer',
              }}>Añadir primer alumno</button>
            </div>
          )}
          {students.length > 0 && filtered.length === 0 && (
            <div style={{ padding: 28, borderRadius: 18, background: CT.card, textAlign: 'center', color: CT.ink3, fontSize: 14 }}>
              No hay alumnos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
        {noStudentHint && (
          <Notice tone="error" style={{ marginTop: 12 }}>
            Primero añade un alumno para poder registrar una clase.
          </Notice>
        )}
      </div>

      {/* Floating actions */}
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32, display: 'flex', gap: 10 }}>
        <button onClick={() => nav('addStudent')} style={{
          flex: 1, height: 56, borderRadius: 16,
          background: '#fff', color: CT.ink, fontSize: 15, fontWeight: 600,
          border: `1px solid ${CT.line}`, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(14,19,17,0.08)',
        }}>
          {Icons.user}<span>Añadir alumno</span>
        </button>
        <button onClick={handleRegistrarClase} style={{
          flex: 1.4, height: 56, borderRadius: 16,
          background: CT.ink, color: '#fff', fontSize: 15, fontWeight: 600,
          border: 'none', fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 12px 28px rgba(14,19,17,0.25)',
        }}>
          {Icons.plus}<span>Registrar clase</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ k, label, accent }) {
  return (
    <div style={{
      background: accent ? CT.ink : CT.card,
      color: accent ? '#fff' : CT.ink,
      border: accent ? 'none' : `1px solid ${CT.line}`,
      borderRadius: 16, padding: '12px 14px',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0 }}>{k}</div>
      <div style={{ fontSize: 11, fontWeight: 500, color: accent ? 'rgba(255,255,255,0.7)' : CT.ink3,
                    marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

function StudentRow({ s, onClick }) {
  const last = s.classes[0];
  const initials = s.name.split(' ').map(x=>x[0]).slice(0,2).join('');
  return (
    <div onClick={onClick} style={{
      background: CT.card, border: `1px solid ${CT.line}`,
      borderRadius: 18, padding: '14px 16px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: '#fff', border: `1px solid ${CT.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 14, color: CT.ink2,
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: CT.ink }}>{s.name}</div>
          <LevelBadge level={s.level} small />
        </div>
        <div style={{ fontSize: 13, color: CT.ink3, marginTop: 4, lineHeight: 1.35 }}>
          {last ? `Foco: ${last.focus} · ${relDate(last.date)}` : 'Sin clases aún'}
        </div>
        {last?.nextFocus && (
          <div style={{ fontSize: 12, color: CT.greenDeep, marginTop: 6, fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: CT.green }} />
            Próximo: {last.nextFocus}
          </div>
        )}
      </div>
      <span style={{ color: CT.ink4 }}>{Icons.chevR}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Add student
// ─────────────────────────────────────────────
function AddStudent({ nav, saveStudent, student }) {
  const editing = !!student;
  const [name, setName] = React.useState(student?.name || '');
  const [contact, setContact] = React.useState(student?.contact || '');
  const [level, setLevel] = React.useState(student?.level || 'Intermedio');
  const [goal, setGoal] = React.useState(student?.goal || '');
  const [freq, setFreq] = React.useState(student?.frequency || '2x / semana');
  const [date, setDate] = React.useState(student?.startDate || '2026-05-07');

  const valid = name.trim().length > 1;

  const submit = () => {
    if (!valid) return;
    saveStudent({
      ...(student || {}),
      name: name.trim(), contact: contact.trim(), level, goal: goal.trim(), frequency: freq, startDate: date,
    });
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 130 }}>
      <ScreenHeader title={editing ? 'Editar alumno' : 'Nuevo alumno'} onBack={() => editing ? nav('profile', student.id) : nav('dashboard')} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <Label>Nombre completo</Label>
          <TextInput value={name} onChange={setName} placeholder="ej. Benito Álvarez" />
        </div>
        <div>
          <Label>Teléfono o email</Label>
          <TextInput value={contact} onChange={setContact} placeholder="benito@mail.com" />
        </div>
        <div>
          <Label>Nivel</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {LEVELS.map(l => (
              <Chip key={l} active={level===l} onClick={()=>setLevel(l)} style={{ flex: 1 }}>{l}</Chip>
            ))}
          </div>
        </div>
        <div>
          <Label>Objetivo principal</Label>
          <TextInput value={goal} onChange={setGoal} placeholder="ej. Mejor control de red" />
        </div>
        <div>
          <Label>Frecuencia de clases</Label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FREQUENCIES.map(f => (
              <Chip key={f} active={freq===f} onClick={()=>setFreq(f)}>{f}</Chip>
            ))}
          </div>
        </div>
        <div>
          <Label>Fecha de inicio</Label>
          <TextInput type="date" value={date} onChange={setDate} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32 }}>
        <PrimaryButton onClick={submit} disabled={!valid}>{editing ? 'Guardar cambios' : 'Añadir alumno'}</PrimaryButton>
      </div>
    </div>
  );
}

function CoachProfileScreen({ profile, isOnboarding, onSubmit, onBack, loading }) {
  const [firstName, setFirstName] = React.useState(profile?.firstName || '');
  const [lastName, setLastName] = React.useState(profile?.lastName || '');
  const [displayName, setDisplayName] = React.useState(profile?.displayName || '');
  const [phone, setPhone] = React.useState(profile?.phone || '');
  const [clubName, setClubName] = React.useState(profile?.clubName || '');
  const [city, setCity] = React.useState(profile?.city || '');

  const valid = firstName.trim().length > 0 && lastName.trim().length > 0 && displayName.trim().length > 0;

  const submit = () => {
    if (!valid || loading) return;
    onSubmit({
      firstName: firstName.trim(), lastName: lastName.trim(), displayName: displayName.trim(),
      phone: phone.trim(), clubName: clubName.trim(), city: city.trim(),
    });
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 130 }}>
      {isOnboarding ? (
        <div style={{ padding: '22px 20px 0' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: CT.ink }}>Completa tu perfil</div>
          <div style={{ fontSize: 14, color: CT.ink3, marginTop: 6, lineHeight: 1.5 }}>
            Esta información aparecerá en tu cuenta y en los reportes que compartes con tus alumnos.
          </div>
        </div>
      ) : (
        <ScreenHeader title="Mi perfil" onBack={onBack} />
      )}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label>Nombre <span style={{ color: CT.danger, fontSize: 11, fontWeight: 500 }}>requerido</span></Label>
          <TextInput value={firstName} onChange={setFirstName} placeholder="ej. Benjamín" />
        </div>
        <div>
          <Label>Apellido <span style={{ color: CT.danger, fontSize: 11, fontWeight: 500 }}>requerido</span></Label>
          <TextInput value={lastName} onChange={setLastName} placeholder="ej. Senti" />
        </div>
        <div>
          <Label>Nombre de coach <span style={{ color: CT.danger, fontSize: 11, fontWeight: 500 }}>requerido</span></Label>
          <TextInput value={displayName} onChange={setDisplayName} placeholder="ej. Coach Benji" />
        </div>
        <div>
          <Label>WhatsApp / teléfono <span style={{ color: CT.ink4, fontSize: 11, fontWeight: 500 }}>opcional</span></Label>
          <TextInput value={phone} onChange={setPhone} placeholder="+34 612 34 56 78" type="tel" />
        </div>
        <div>
          <Label>Club o academia <span style={{ color: CT.ink4, fontSize: 11, fontWeight: 500 }}>opcional</span></Label>
          <TextInput value={clubName} onChange={setClubName} placeholder="ej. Padel Arena Barcelona" />
        </div>
        <div>
          <Label>Ciudad <span style={{ color: CT.ink4, fontSize: 11, fontWeight: 500 }}>opcional</span></Label>
          <TextInput value={city} onChange={setCity} placeholder="ej. Barcelona" />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32 }}>
        <PrimaryButton onClick={submit} disabled={!valid || loading}>
          {loading ? 'Guardando...' : isOnboarding ? 'Guardar y continuar' : 'Guardar cambios'}
        </PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, AddStudent, CoachProfileScreen });

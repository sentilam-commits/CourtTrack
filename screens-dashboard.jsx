// Coach Dashboard + Add Student

function Dashboard({ students, nav, user, onLogout, message }) {
  const [q, setQ] = React.useState('');
  const filtered = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  const todayCount = students.filter(s => {
    const last = s.classes[0]?.date;
    return last === '2026-05-06' || last === '2026-05-07';
  }).length;

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 120 }}>
      {/* Header band */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 13, color: CT.ink3, fontWeight: 500 }}>Jueves, 7 mayo</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: CT.ink, letterSpacing: 0, marginTop: 2 }}>
              Hola, Coach Diego
            </div>
          </div>
          <button onClick={onLogout} title={user?.email || 'Salir'} style={{
            width: 44, height: 44, borderRadius: 999, border: 'none',
            background: CT.greenSoft, color: CT.greenDeep, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
          }}>{(user?.email || 'CT').slice(0, 2).toUpperCase()}</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
          <StatCard k={students.length} label="Alumnos" />
          <StatCard k={todayCount} label="Hoy" accent />
          <StatCard k={students.reduce((a,s)=>a+s.classes.length,0)} label="Registros" />
        </div>
      </div>

      {message?.text && (
        <div style={{ padding: '0 20px 12px' }}>
          <Notice tone={message.type}>{message.text}</Notice>
        </div>
      )}

      {/* Search */}
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

      {/* Students */}
      <div style={{ padding: '6px 20px 0' }}>
        <SectionLabel>Alumnos</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(s => <StudentRow key={s.id} s={s} onClick={() => nav('profile', s.id)} />)}
          {students.length === 0 && (
            <div style={{ padding: 28, borderRadius: 18, background: CT.card, textAlign: 'center', color: CT.ink3, fontSize: 14, lineHeight: 1.45 }}>
              Aún no tienes alumnos. Añade el primero para empezar a registrar clases.
            </div>
          )}
          {students.length > 0 && filtered.length === 0 && (
            <div style={{ padding: 28, borderRadius: 18, background: CT.card, textAlign: 'center', color: CT.ink3, fontSize: 14 }}>
              No hay alumnos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* Floating add */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 32,
        display: 'flex', gap: 10,
      }}>
        <button onClick={() => nav('addStudent')} style={{
          flex: 1, height: 56, borderRadius: 16,
          background: '#fff', color: CT.ink, fontSize: 15, fontWeight: 600,
          border: `1px solid ${CT.line}`, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(14,19,17,0.08)',
        }}>
          {Icons.user}<span>Añadir alumno</span>
        </button>
        <button onClick={() => nav('pickStudent')} style={{
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

Object.assign(window, { Dashboard, AddStudent });

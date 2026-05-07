// Student profile + Update scores + Pick student (for "log a class" entry from dashboard)

function StudentProfile({ student, nav, updateScores, deleteStudent, deleteClassLog }) {
  const [tab, setTab] = React.useState('overview'); // overview / history / scores
  const [editingScores, setEditingScores] = React.useState(false);
  const [scoreDraft, setScoreDraft] = React.useState(student.scores);
  const [confirm, setConfirm] = React.useState(null);
  const last = student.classes[0];

  React.useEffect(() => { setScoreDraft(student.scores); }, [student.id]);

  const initials = student.name.split(' ').map(x=>x[0]).slice(0,2).join('');

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 120 }}>
      <ScreenHeader
        title=""
        onBack={() => nav('dashboard')}
        right={
          <button onClick={() => nav('share', student.id)} style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: 'transparent', cursor: 'pointer', color: CT.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.share}</button>
        }
      />
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.label}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            const action = confirm.onConfirm;
            setConfirm(null);
            action();
          }}
        />
      )}

      {/* Hero */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: CT.greenSoft, color: CT.greenDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 18,
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: CT.ink, letterSpacing: 0 }}>{student.name}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <LevelBadge level={student.level} small />
              <span style={{ fontSize: 12, color: CT.ink3 }}>{student.frequency}</span>
              <span style={{ fontSize: 12, color: CT.ink4 }}>·</span>
              <span style={{ fontSize: 12, color: CT.ink3 }}>desde {fmtDate(student.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Goal card */}
        <div style={{
          marginTop: 16, padding: '14px 16px', borderRadius: 16,
          background: CT.greenSoft, border: `1px solid ${CT.green}33`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ color: CT.greenDeep }}>{Icons.flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: CT.greenDeep,
                          textTransform: 'uppercase', letterSpacing: 0.5 }}>Objetivo principal</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: CT.greenDeep, marginTop: 2 }}>
              {student.goal || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px', marginTop: 8 }}>
        <div style={{
          display: 'flex', gap: 4, padding: 4,
          background: CT.card, borderRadius: 12, border: `1px solid ${CT.line}`,
        }}>
          {[['overview','Resumen'],['history','Historial'],['scores','Puntuación']].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, height: 36, borderRadius: 9, border: 'none',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? CT.ink : CT.ink3,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <SectionLabel>Alumno</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <GhostButton onClick={() => nav('editStudent', student.id)} style={{ height: 46, justifyContent: 'center' }}>
                  {Icons.edit} Editar alumno
                </GhostButton>
                <button onClick={() => setConfirm({
                  title: 'Eliminar alumno',
                  body: `Se eliminará ${student.name}, sus clases y sus puntuaciones. Esta acción no se puede deshacer.`,
                  label: 'Eliminar',
                  onConfirm: () => deleteStudent(student.id),
                })} style={{
                  height: 46, borderRadius: 12, border: `1px solid ${CT.danger}44`,
                  background: '#fff', color: CT.danger, fontSize: 14, fontWeight: 650,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}>Eliminar alumno</button>
              </div>
            </div>

            {last ? (
              <div>
                <SectionLabel>Última clase · {fmtDate(last.date)}</SectionLabel>
                <Card>
                  <Row k="Foco" v={last.focus} />
                  <Divider />
                  <Row k="Mejoró" v={last.improved.join(', ')} />
                  <Divider />
                  <Row k="Corrección" v={last.correction} danger />
                  <Divider />
                  <Row k="Tarea" v={last.homework} />
                  <Divider />
                  <Row k="Próximo foco" v={last.nextFocus} accent />
                  {last.note && (
                    <>
                      <Divider />
                      <div style={{ fontSize: 13, color: CT.ink3, marginBottom: 4, marginTop: 4 }}>Nota del coach</div>
                      <div style={{ fontSize: 14, color: CT.ink, fontStyle: 'italic', lineHeight: 1.4 }}>
                        “{last.note}”
                      </div>
                    </>
                  )}
                </Card>
              </div>
            ) : (
              <div style={{
                padding: 30, borderRadius: 18, background: CT.card,
                textAlign: 'center', color: CT.ink3, fontSize: 14,
              }}>
                Aún no hay clases registradas.
              </div>
            )}

            <div>
              <SectionLabel>Estadísticas rápidas</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <MiniStat label="Clases" value={student.classes.length} />
                <MiniStat label="Promedio" value={
                  (Object.values(student.scores).reduce((a,b)=>a+b,0) / SKILLS.length).toFixed(1)
                } />
              </div>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {student.classes.length === 0 && (
              <div style={{ padding: 30, borderRadius: 18, background: CT.card,
                textAlign: 'center', color: CT.ink3, fontSize: 14 }}>Aún no hay historial.</div>
            )}
            {student.classes.map(c => (
              <Card key={c.id} soft>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: CT.ink }}>{fmtDate(c.date)}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: CT.ink3,
                                 padding: '3px 8px', borderRadius: 999,
                                 background: '#fff', border: `1px solid ${CT.line}` }}>{c.type}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: CT.ink, marginTop: 6 }}>{c.focus}</div>
                <div style={{ fontSize: 13, color: CT.ink3, marginTop: 4 }}>
                  Mejoró: {c.improved.join(', ')}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <GhostButton onClick={() => nav('editClass', student.id, { classId: c.id })} style={{ height: 38, flex: 1, justifyContent: 'center' }}>
                    {Icons.edit} Editar
                  </GhostButton>
                  <button onClick={() => setConfirm({
                    title: 'Eliminar clase',
                    body: `Se eliminará el registro del ${fmtDate(c.date)}. Esta acción no se puede deshacer.`,
                    label: 'Eliminar',
                    onConfirm: () => deleteClassLog(student.id, c.id),
                  })} style={{
                    height: 38, flex: 1, borderRadius: 12,
                    border: `1px solid ${CT.danger}44`, background: '#fff',
                    color: CT.danger, fontSize: 13, fontWeight: 650, fontFamily: 'inherit', cursor: 'pointer',
                  }}>Eliminar</button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'scores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <SectionLabel style={{ marginBottom: 0 }}>Puntuación de habilidades</SectionLabel>
              <button onClick={() => {
                if (editingScores) updateScores(student.id, scoreDraft);
                setEditingScores(!editingScores);
              }} style={{
                fontSize: 13, fontWeight: 600, color: CT.green,
                background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>{editingScores ? 'Guardar' : 'Editar'}</button>
            </div>
            <Card>
              {SKILLS.map((sk, i) => (
                <div key={sk}>
                  {i > 0 && <Divider />}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 0' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: CT.ink }}>{sk}</div>
                    {editingScores ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setScoreDraft({...scoreDraft, [sk]: n})} style={{
                            width: 28, height: 28, borderRadius: 8,
                            border: `1px solid ${scoreDraft[sk]===n ? CT.green : CT.line}`,
                            background: scoreDraft[sk]===n ? CT.green : '#fff',
                            color: scoreDraft[sk]===n ? '#fff' : CT.ink2,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          }}>{n}</button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ScoreBar value={student.scores[sk]} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: CT.ink2, width: 14, textAlign: 'right' }}>
                          {student.scores[sk]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {!editingScores && (
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32, display: 'flex', gap: 10 }}>
          <button onClick={() => nav('share', student.id)} style={{
            flex: 1, height: 54, borderRadius: 16,
            background: '#fff', color: CT.ink, fontSize: 15, fontWeight: 600,
            border: `1px solid ${CT.line}`, fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 8px 24px rgba(14,19,17,0.06)',
          }}>{Icons.share} Compartir</button>
          <button onClick={() => nav('logClass', student.id)} style={{
            flex: 1.4, height: 54, borderRadius: 16,
            background: CT.ink, color: '#fff', fontSize: 15, fontWeight: 600,
            border: 'none', fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 12px 28px rgba(14,19,17,0.25)',
          }}>{Icons.plus} Registrar clase</button>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, accent, danger }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '8px 0', gap: 12 }}>
      <div style={{ fontSize: 13, color: CT.ink3, flexShrink: 0, paddingTop: 1 }}>{k}</div>
      <div style={{ fontSize: 14, fontWeight: 500, textAlign: 'right',
                    color: accent ? CT.greenDeep : danger ? '#A04020' : CT.ink, lineHeight: 1.4 }}>{v}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: CT.line }} />;
}

function MiniStat({ label, value }) {
  return (
    <div style={{
      background: CT.card, border: `1px solid ${CT.line}`,
      borderRadius: 16, padding: '14px 16px',
    }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: CT.ink, letterSpacing: 0 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: CT.ink3, marginTop: 2,
                    textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pick student (for "Log a class" from dashboard)
// ─────────────────────────────────────────────────────────────
function PickStudent({ students, nav }) {
  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 60 }}>
      <ScreenHeader title="Elige un alumno" onBack={() => nav('dashboard')} />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {students.length === 0 && (
          <div style={{ padding: 28, borderRadius: 18, background: CT.card, textAlign: 'center', color: CT.ink3, fontSize: 14, lineHeight: 1.45 }}>
            Aún no hay alumnos. Añade un alumno antes de registrar una clase.
          </div>
        )}
        {students.map(s => (
          <StudentRow key={s.id} s={s} onClick={() => nav('logClass', s.id)} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { StudentProfile, PickStudent });

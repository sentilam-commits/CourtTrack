// The 60-second class log flow

function LogClass({ student, nav, saveClassLog, existingLog }) {
  const [step, setStep] = React.useState(0);
  const [date, setDate] = React.useState(existingLog?.date || '2026-05-07');
  const [type, setType] = React.useState(existingLog?.type || 'Privada');
  const [focus, setFocus] = React.useState(existingLog?.focus || '');
  const [improved, setImproved] = React.useState(existingLog?.improved || []);
  const [correction, setCorrection] = React.useState(existingLog?.correction || '');
  const [homework, setHomework] = React.useState(existingLog?.homework || '');
  const [homeworkCustom, setHomeworkCustom] = React.useState('');
  const [nextFocus, setNextFocus] = React.useState(existingLog?.nextFocus || '');
  const [nextFocusCustom, setNextFocusCustom] = React.useState('');
  const [note, setNote] = React.useState(existingLog?.note || '');

  const homeworkValue = homework === '__other' ? homeworkCustom.trim() : homework;
  const nextFocusValue = nextFocus === '__other' ? nextFocusCustom.trim() : nextFocus;

  const steps = [
    { key: 'when', title: 'Cuándo' },
    { key: 'focus', title: 'Foco de hoy' },
    { key: 'improved', title: 'Qué mejoró' },
    { key: 'correction', title: 'Corrección principal' },
    { key: 'homework', title: 'Tarea' },
    { key: 'next', title: 'Foco de la próxima clase' },
    { key: 'note', title: 'Nota del coach (opcional)' },
    { key: 'review', title: 'Revisar' },
  ];

  const cur = steps[step];
  const total = steps.length;

  const canNext = (() => {
    if (cur.key === 'when') return !!date && !!type;
    if (cur.key === 'focus') return !!focus;
    if (cur.key === 'improved') return improved.length > 0;
    if (cur.key === 'correction') return !!correction;
    if (cur.key === 'homework') return !!homeworkValue;
    if (cur.key === 'next') return !!nextFocusValue;
    if (cur.key === 'note') return true;
    return true;
  })();

  const submit = () => {
    saveClassLog(student.id, {
      ...(existingLog || {}),
      date, type, focus, improved, correction,
      homework: homeworkValue,
      nextFocus: nextFocusValue, note,
    });
    nav('share', student.id, { fromLog: true });
  };

  const toggleImproved = (v) => {
    setImproved(improved.includes(v) ? improved.filter(x => x !== v) : [...improved, v]);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader
        title={`Clase de ${student.name.split(' ')[0]}`}
        onBack={() => step === 0 ? nav('profile', student.id) : setStep(step - 1)}
      />

      {/* Progress dots */}
      <div style={{ padding: '0 20px 8px', display: 'flex', gap: 4 }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? CT.green : CT.line,
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <div style={{ padding: '4px 20px 0', fontSize: 12, color: CT.ink3, fontWeight: 500 }}>
        Paso {step + 1} de {total}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: '20px 20px 0', overflow: 'auto' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: CT.ink, letterSpacing: 0, marginBottom: 18 }}>
          {cur.title}
        </div>

        {cur.key === 'when' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <Label>Fecha</Label>
              <TextInput type="date" value={date} onChange={setDate} />
            </div>
            <div>
              <Label>Tipo de clase</Label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CLASS_TYPES.map(t => (
                  <Chip key={t} active={type===t} onClick={()=>setType(t)} style={{ flex: 1 }}>{t}</Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {cur.key === 'focus' && <ChipGrid options={FOCUS_OPTIONS} value={focus} onSelect={setFocus} />}
        {cur.key === 'improved' && (
          <div>
            <div style={{ fontSize: 13, color: CT.ink3, marginBottom: 14 }}>Marca todo lo que aplique</div>
            <ChipGrid options={IMPROVED_OPTIONS} value={improved} onSelect={toggleImproved} multi />
          </div>
        )}
        {cur.key === 'correction' && <ChipGrid options={CORRECTION_OPTIONS} value={correction} onSelect={setCorrection} />}
        {cur.key === 'homework' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ChipGrid options={HOMEWORK_OPTIONS} value={homework} onSelect={setHomework} stacked />
            <button onClick={() => setHomework('__other')} style={{
              textAlign: 'left', padding: '14px 16px',
              border: `1px dashed ${homework === '__other' ? CT.green : CT.ink4}`,
              background: homework === '__other' ? CT.greenSoft : '#fff',
              color: homework === '__other' ? CT.greenDeep : CT.ink2,
              borderRadius: 14, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 6,
                border: `1.5px solid ${homework === '__other' ? CT.green : CT.ink4}`,
                background: homework === '__other' ? CT.green : 'transparent', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{homework === '__other' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}</span>
              <span style={{ flex: 1 }}>Otro — escribe tu propia tarea</span>
            </button>
            {homework === '__other' && (
              <textarea
                value={homeworkCustom}
                onChange={(e) => setHomeworkCustom(e.target.value)}
                placeholder="ej. 15 min de peloteo cruzado de revés, 2x esta semana"
                rows={3}
                autoFocus
                style={{
                  width: '100%', padding: 14, borderRadius: 14,
                  border: `1px solid ${CT.green}`, background: '#fff',
                  fontSize: 15, fontFamily: 'inherit', color: CT.ink,
                  outline: 'none', boxSizing: 'border-box', resize: 'none', lineHeight: 1.4,
                  marginTop: 4,
                }}
              />
            )}
          </div>
        )}
        {cur.key === 'next' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ChipGrid options={FOCUS_OPTIONS} value={nextFocus} onSelect={setNextFocus} />
            <button onClick={() => setNextFocus('__other')} style={{
              alignSelf: 'flex-start', padding: '9px 14px',
              border: `1px dashed ${nextFocus === '__other' ? CT.green : CT.ink4}`,
              background: nextFocus === '__other' ? CT.greenSoft : '#fff',
              color: nextFocus === '__other' ? CT.greenDeep : CT.ink2,
              borderRadius: 999, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer',
            }}>+ Otro</button>
            {nextFocus === '__other' && (
              <input
                value={nextFocusCustom}
                onChange={(e) => setNextFocusCustom(e.target.value)}
                placeholder="ej. Globo defensivo"
                autoFocus
                style={{
                  width: '100%', height: 50, padding: '0 16px', borderRadius: 14,
                  border: `1px solid ${CT.green}`, background: '#fff',
                  fontSize: 16, fontFamily: 'inherit', color: CT.ink,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        )}

        {cur.key === 'note' && (
          <div>
            <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="¿Algo personal que decir?"
              rows={5}
              style={{
                width: '100%', padding: 16, borderRadius: 14,
                border: `1px solid ${CT.line}`, background: '#fff',
                fontSize: 16, fontFamily: 'inherit', color: CT.ink,
                outline: 'none', boxSizing: 'border-box', resize: 'none', lineHeight: 1.4,
              }}
            />
            <div style={{ fontSize: 12, color: CT.ink4, marginTop: 8 }}>Opcional — puede quedar vacío.</div>
          </div>
        )}

        {cur.key === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Card>
              <Row k="Fecha" v={fmtDate(date)} />
              <Divider />
              <Row k="Tipo" v={type} />
              <Divider />
              <Row k="Foco" v={focus} />
              <Divider />
              <Row k="Mejoró" v={improved.join(', ')} />
              <Divider />
              <Row k="Corrección" v={correction} danger />
              <Divider />
              <Row k="Tarea" v={homeworkValue} />
              <Divider />
              <Row k="Próximo foco" v={nextFocusValue} accent />
              {note && (<><Divider /><Row k="Nota" v={note} /></>)}
            </Card>
            <div style={{ fontSize: 13, color: CT.ink3, textAlign: 'center', marginTop: 4 }}>
              Pulsa guardar para registrar esta clase y generar el enlace.
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div style={{ padding: '16px 20px 32px', background: '#fff', borderTop: `1px solid ${CT.line}` }}>
        {cur.key === 'review' ? (
          <PrimaryButton onClick={submit}>{existingLog ? 'Guardar cambios' : 'Guardar y generar enlace'}</PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={() => canNext && setStep(step + 1)}
            disabled={!canNext}
          >
            {cur.key === 'note' ? 'Revisar' : 'Continuar'}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

function ChipGrid({ options, value, onSelect, multi, stacked }) {
  if (stacked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(o => {
          const active = multi ? value.includes(o) : value === o;
          return (
            <button key={o} onClick={() => onSelect(o)} style={{
              textAlign: 'left', padding: '14px 16px',
              border: `1px solid ${active ? CT.green : CT.line}`,
              background: active ? CT.greenSoft : '#fff',
              color: active ? CT.greenDeep : CT.ink,
              borderRadius: 14, fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 6,
                border: `1.5px solid ${active ? CT.green : CT.ink4}`,
                background: active ? CT.green : 'transparent', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}</span>
              <span style={{ flex: 1 }}>{o}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = multi ? value.includes(o) : value === o;
        return <Chip key={o} active={active} onClick={() => onSelect(o)}>{o}</Chip>;
      })}
    </div>
  );
}

Object.assign(window, { LogClass });

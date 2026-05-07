// Share screen + Student-facing public progress page

function ShareScreen({ student, nav, fromLog }) {
  const [copied, setCopied] = React.useState(false);
  const url = `${location.origin}${location.pathname}#/p/${student.id}`;

  return (
    <div style={{ background: '#fff', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Compartir progreso" onBack={() => nav('profile', student.id)} />

      {fromLog && (
        <div style={{
          margin: '0 20px 16px', padding: '14px 16px',
          background: CT.greenSoft, border: `1px solid ${CT.green}33`,
          borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 999, background: CT.green,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>{Icons.check}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: CT.greenDeep }}>Clase registrada</div>
            <div style={{ fontSize: 12, color: CT.greenDeep, opacity: 0.8, marginTop: 1 }}>
              La página de {student.name.split(' ')[0]} se ha actualizado.
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Preview pane */}
        <div style={{
          borderRadius: 22, overflow: 'hidden',
          border: `1px solid ${CT.line}`, background: CT.card2,
          boxShadow: '0 12px 32px rgba(14,19,17,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderBottom: `1px solid ${CT.line}`,
            background: '#fff',
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#E5675F' }} />
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#E5B85F' }} />
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#7DBE5F' }} />
            </div>
            <div style={{ fontSize: 11, color: CT.ink4, marginLeft: 6, fontFamily: 'ui-monospace, monospace' }}>
              {url}
            </div>
          </div>
          <div style={{ padding: 16, transform: 'scale(0.78)', transformOrigin: 'top center', height: 360, overflow: 'hidden' }}>
            <PublicProgress student={student} previewMode />
          </div>
        </div>

        {/* Link row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 14px', borderRadius: 14,
          background: CT.card, border: `1px solid ${CT.line}`,
        }}>
          <span style={{ color: CT.ink3 }}>{Icons.link}</span>
          <div style={{ flex: 1, fontSize: 13, color: CT.ink2, fontFamily: 'ui-monospace, monospace',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</div>
          <button onClick={() => { setCopied(true); setTimeout(()=>setCopied(false), 1400); }} style={{
            height: 36, padding: '0 14px', borderRadius: 10,
            background: copied ? CT.green : CT.ink, color: '#fff',
            border: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>{copied ? <>{Icons.check} Copiado</> : <>{Icons.copy} Copiar</>}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <GhostButton onClick={() => nav('public', student.id)} style={{ height: 50, justifyContent: 'center', flex: 1 }}>
            Ver como alumno
          </GhostButton>
          <button onClick={() => nav('profile', student.id)} style={{
            height: 50, borderRadius: 12, background: CT.ink, color: '#fff',
            border: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>Listo</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Public, student-facing page
// ─────────────────────────────────────────────────────────────
function PublicProgress({ student, nav, previewMode }) {
  if (!student) {
    return (
      <div style={{ background: '#fff', minHeight: '100%', padding: previewMode ? 0 : '22px 20px 60px' }}>
        {!previewMode && <ScreenHeader title="" onBack={nav ? () => nav('dashboard') : undefined} />}
        <div style={{ padding: 28, borderRadius: 20, background: CT.card, textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: CT.ink }}>Alumno no encontrado</div>
          <div style={{ fontSize: 14, color: CT.ink3, lineHeight: 1.45, marginTop: 8 }}>
            El enlace no existe o ya no está disponible.
          </div>
        </div>
      </div>
    );
  }
  const last = student.classes[0];
  const firstName = student.name.split(' ')[0];
  const avg = (Object.values(student.scores).reduce((a,b)=>a+b,0) / SKILLS.length).toFixed(1);

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 60 }}>
      {!previewMode && (
        <ScreenHeader title="" onBack={nav ? () => nav('share', student.id) : undefined}
          right={<span style={{ fontSize: 11, color: CT.ink4, fontWeight: 500, paddingRight: 6 }}>VISTA ALUMNO</span>} />
      )}

      {/* Hero */}
      <div style={{
        margin: previewMode ? 0 : '0 20px',
        background: CT.ink, color: '#fff',
        borderRadius: 24, padding: '24px 22px 22px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* deco */}
        <div style={{
          position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 999,
          background: `radial-gradient(circle, ${CT.green}55, transparent 70%)`,
        }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
                      color: CT.green, textTransform: 'uppercase' }}>
          Progreso de pádel · {firstName}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0, marginTop: 6, lineHeight: 1.15 }}>
          Hola {firstName} — así vas progresando.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,0.14)', color: '#fff',
          }}>{student.level}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{student.frequency}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>desde {fmtDate(student.startDate)}</span>
        </div>
      </div>

      <div style={{ padding: previewMode ? '20px 0 0' : '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Goal */}
        <Card style={{ background: CT.greenSoft, borderColor: `${CT.green}33` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: CT.greenDeep, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Objetivo principal
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: CT.greenDeep, marginTop: 4, letterSpacing: 0 }}>
            {student.goal}
          </div>
        </Card>

        {last && (
          <>
            <div>
              <SectionLabel>Última clase · {fmtDate(last.date)}</SectionLabel>
              <Card>
                <div style={{ fontSize: 12, color: CT.ink3 }}>Foco de esta semana</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CT.ink, marginTop: 2, letterSpacing: 0 }}>
                  {last.focus}
                </div>
              </Card>
            </div>

            <FeedbackBlock
              kicker="Mejoraste"
              body={improvedSentence(last.improved)}
              tone="good"
            />
            <FeedbackBlock
              kicker="Sigue trabajando en"
              body={correctionSentence(last.correction)}
              tone="warn"
            />
            <FeedbackBlock
              kicker="Tarea de la semana"
              body={last.homework}
              tone="action"
            />

            {last.note && (
              <Card style={{ background: '#fff', border: `1px dashed ${CT.line}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: CT.ink3,
                              textTransform: 'uppercase', letterSpacing: 0.5 }}>Nota del coach</div>
                <div style={{ fontSize: 15, color: CT.ink, marginTop: 6, fontStyle: 'italic', lineHeight: 1.45 }}>
                  “{last.note}”
                </div>
              </Card>
            )}

            <div>
              <SectionLabel>Próxima clase</SectionLabel>
              <div style={{
                padding: '16px 18px', borderRadius: 16,
                background: CT.ink, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
                                fontWeight: 600, letterSpacing: 0.5 }}>Trabajaremos en</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, letterSpacing: 0 }}>
                    {last.nextFocus}
                  </div>
                </div>
                <span style={{ color: CT.green }}>{Icons.arrow}</span>
              </div>
            </div>
          </>
        )}

        {/* Scores */}
        <div>
          <SectionLabel>Tu mapa de habilidades · prom. {avg}/5</SectionLabel>
          <Card>
            {SKILLS.map((sk, i) => (
              <div key={sk}>
                {i > 0 && <Divider />}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '10px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: CT.ink }}>{sk}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ScoreBar value={student.scores[sk]} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: CT.ink2,
                                   width: 22, textAlign: 'right' }}>{student.scores[sk]}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: CT.ink4, padding: '8px 0 24px' }}>
          Enviado con CourtTrack  ·  Coach Diego Marín
        </div>
      </div>
    </div>
  );
}

function FeedbackBlock({ kicker, body, tone }) {
  const palette = {
    good:   { bg: CT.greenSoft, fg: CT.greenDeep, dot: CT.green },
    warn:   { bg: '#FDF2E5',    fg: '#A05A1B',    dot: '#D58A3F' },
    action: { bg: '#F1F1EE',    fg: CT.ink,       dot: CT.ink2 },
  }[tone];
  return (
    <div style={{ background: palette.bg, borderRadius: 18, padding: '16px 18px',
                  border: `1px solid ${palette.dot}22` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: palette.dot }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: palette.fg,
                      textTransform: 'uppercase', letterSpacing: 0.5 }}>{kicker}</div>
      </div>
      <div style={{ fontSize: 15, color: palette.fg, marginTop: 8, lineHeight: 1.5, fontWeight: 500 }}>
        {body}
      </div>
    </div>
  );
}

function improvedSentence(arr) {
  if (!arr || arr.length === 0) return '';
  const map = {
    'Timing': 'tu timing con la pelota',
    'Punto de contacto': 'contactar la pelota antes y más adelante',
    'Control': 'tu control general',
    'Juego de pies': 'tu juego de pies entre golpes',
    'Confianza': 'tu confianza en el peloteo',
    'Paciencia': 'tu paciencia para construir el punto',
    'Posicionamiento': 'tu posicionamiento en pista',
    'Consistencia': 'tu consistencia en peloteos largos',
    'Recuperación tras golpe': 'tu recuperación después de cada golpe',
    'Selección de golpe': 'tu selección de golpe bajo presión',
  };
  const phrases = arr.map(a => map[a] || a.toLowerCase());
  return 'Mejoraste ' + phrases.join(', ') + '.';
}
function correctionSentence(c) {
  const map = {
    'Demasiado swing': 'Aún haces demasiado swing cuando la bola viene rápida — mantenlo corto y compacto.',
    'Contacto tardío': 'Sigues contactando la bola un poco tarde. Prepara la pala antes.',
    'Mala recuperación': 'Recupera hacia el centro justo después de cada golpe.',
    'Demasiado cerca de la red': 'Da un paso atrás de la red para que los globos no te sorprendan.',
    'Demasiado atrás': 'Entra tras defender — no te quedes pegado al cristal de fondo.',
    'Apresurar el punto': 'No te apresures. Espera la bola correcta para atacar.',
    'Split step deficiente': 'Split step antes de cada golpe — lo cambia todo.',
    'Preparación de pala baja': 'Mantén la pala arriba y lista antes.',
    'Mala decisión bajo presión': 'Elige opciones más simples y seguras cuando el punto se acelera.',
    'Falta de paciencia': 'Construye el punto. La paciencia gana en pádel.',
  };
  return map[c] || c;
}

Object.assign(window, { ShareScreen, PublicProgress });

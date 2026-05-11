const { useEffect, useMemo, useState } = React;
const store = createCourtTrackStore();

function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [route, setRoute] = useState({ name: 'loading' });
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState(null);

  const nav = (name, studentId, meta = {}) => {
    if (name === 'public' && studentId) history.replaceState(null, '', `#/p/${studentId}`);
    if (name !== 'public' && location.hash.startsWith('#/p/')) history.replaceState(null, '', location.pathname);
    setRoute({ name, studentId, meta });
  };

  const withTimeout = (promise, ms, fallback) => Promise.race([
    promise,
    new Promise(resolve => setTimeout(() => resolve(fallback), ms)),
  ]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3200);
  };

  const refreshStudents = async (currentUser = user) => {
    if (!currentUser) return;
    const loaded = await store.loadStudents(currentUser);
    setStudents(loaded);
  };

  useEffect(() => {
    (async () => {
      try {
        const publicId = location.hash.startsWith('#/p/') ? location.hash.replace('#/p/', '') : null;
        const session = await withTimeout(store.getSession(), 5000, { user: null });
        if (publicId) {
          const publicStudent = session.user
            ? (await store.loadStudents(session.user)).find(s => s.id === publicId)
            : await store.getPublicStudent(publicId);
          setUser(session.user || null);
          if (session.user) setStudents(await store.loadStudents(session.user));
          setRoute({ name: 'public', studentId: publicId, meta: { publicStudent } });
        } else if (session.user) {
          setUser(session.user);
          const [loadedProfile] = await Promise.all([
            store.loadProfile(session.user),
            refreshStudents(session.user),
          ]);
          setProfile(loadedProfile);
          const complete = loadedProfile?.firstName && loadedProfile?.lastName && loadedProfile?.displayName;
          setRoute({ name: complete ? 'dashboard' : 'onboarding' });
        } else {
          setRoute({ name: 'auth' });
        }
      } catch (err) {
        showMessage(err.message || 'No se pudo iniciar CourtTrack.', 'error');
        setRoute({ name: 'auth' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const requireUser = () => {
    if (!user) throw new Error('Inicia sesión para continuar.');
    return user;
  };

  const handleAuth = async (email, password) => {
    setBusy(true);
    try {
      const result = authMode === 'signup' ? await store.signUp(email, password) : await store.signIn(email, password);
      setUser(result.user);
      const [loadedProfile] = await Promise.all([
        store.loadProfile(result.user),
        refreshStudents(result.user),
      ]);
      setProfile(loadedProfile);
      const complete = loadedProfile?.firstName && loadedProfile?.lastName && loadedProfile?.displayName;
      if (complete) {
        showMessage(authMode === 'signup' ? 'Cuenta creada.' : 'Sesión iniciada.');
        nav('dashboard');
      } else {
        nav('onboarding');
      }
    } catch (err) {
      showMessage(authMode === 'login' ? 'Email o contraseña incorrectos.' : (err.message || 'No se pudo crear la cuenta.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProfile = async (profileData) => {
    setBusy(true);
    try {
      const currentUser = requireUser();
      const saved = await store.saveProfile(currentUser, profileData);
      setProfile(saved);
      nav('dashboard');
      showMessage('Perfil guardado.');
    } catch (err) {
      showMessage(err.message || 'No se pudo guardar el perfil.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await store.signOut();
    setUser(null);
    setStudents([]);
    setProfile(null);
    setRoute({ name: 'auth' });
    showMessage('Sesión cerrada.');
  };

  const saveStudent = async (student) => {
    setBusy(true);
    try {
      const currentUser = requireUser();
      if (student.id) {
        await store.updateStudent(currentUser, student.id, student);
        await refreshStudents(currentUser);
        nav('profile', student.id);
        showMessage('Alumno actualizado.');
      } else {
        const saved = await store.createStudent(currentUser, student);
        await refreshStudents(currentUser);
        nav('profile', saved.id);
        showMessage('Alumno añadido.');
      }
    } catch (err) {
      showMessage(err.message || 'No se pudo guardar el alumno.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const deleteStudent = async (studentId) => {
    setBusy(true);
    try {
      const currentUser = requireUser();
      await store.deleteStudent(currentUser, studentId);
      await refreshStudents(currentUser);
      nav('dashboard');
      showMessage('Alumno eliminado.');
    } catch (err) {
      showMessage(err.message || 'No se pudo eliminar el alumno.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const saveClassLog = async (studentId, log) => {
    setBusy(true);
    try {
      const currentUser = requireUser();
      if (log.id) {
        await store.updateClassLog(currentUser, studentId, log.id, log);
        await refreshStudents(currentUser);
        nav('profile', studentId);
        showMessage('Clase actualizada.');
      } else {
        await store.createClassLog(currentUser, studentId, log);
        await refreshStudents(currentUser);
        nav('share', studentId, { fromLog: true });
        showMessage('Clase registrada.');
      }
    } catch (err) {
      showMessage(err.message || 'No se pudo guardar la clase.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const deleteClassLog = async (studentId, logId) => {
    setBusy(true);
    try {
      const currentUser = requireUser();
      await store.deleteClassLog(currentUser, studentId, logId);
      await refreshStudents(currentUser);
      setRoute({ name: 'profile', studentId, meta: { tab: 'history' } });
      showMessage('Clase eliminada.');
    } catch (err) {
      showMessage(err.message || 'No se pudo eliminar la clase.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const saveScores = async (studentId, scores) => {
    try {
      const currentUser = requireUser();
      await store.updateScores(currentUser, studentId, scores);
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, scores } : s));
      showMessage('Puntuaciones guardadas.');
    } catch (err) {
      showMessage(err.message || 'No se pudieron guardar las puntuaciones.', 'error');
    }
  };

  const student = useMemo(() => students.find(s => s.id === route.studentId), [students, route.studentId]);
  const existingLog = student?.classes.find(c => c.id === route.meta?.classId);

  let screen;
  if (loading || route.name === 'loading') {
    screen = <div style={{ background: '#fff', minHeight: '100%', padding: 24, color: CT.ink3 }}>Cargando CourtTrack...</div>;
  } else if (route.name === 'auth' || !user && route.name !== 'public') {
    screen = <AuthScreen mode={authMode} setMode={setAuthMode} onSubmit={handleAuth} loading={busy} message={message} />;
  } else {
    switch (route.name) {
      case 'dashboard':
        screen = <Dashboard students={students} nav={nav} user={user} onLogout={logout} message={message} profile={profile} />; break;
      case 'onboarding':
        screen = <CoachProfileScreen isOnboarding onSubmit={handleSaveProfile} loading={busy} />; break;
      case 'editProfile':
        screen = <CoachProfileScreen profile={profile} onSubmit={handleSaveProfile} onBack={() => nav('dashboard')} loading={busy} />; break;
      case 'addStudent':
        screen = <AddStudent nav={nav} saveStudent={saveStudent} />; break;
      case 'editStudent':
        screen = student ? <AddStudent nav={nav} saveStudent={saveStudent} student={student} /> : <Dashboard students={students} nav={nav} user={user} onLogout={logout} profile={profile} />; break;
      case 'pickStudent':
        screen = <PickStudent students={students} nav={nav} />; break;
      case 'profile':
        screen = student ? <StudentProfile student={student} nav={nav} updateScores={saveScores} deleteStudent={deleteStudent} deleteClassLog={deleteClassLog} />
                         : <Dashboard students={students} nav={nav} user={user} onLogout={logout} profile={profile} />; break;
      case 'logClass':
        screen = student ? <LogClass student={student} nav={nav} saveClassLog={saveClassLog} />
                         : <Dashboard students={students} nav={nav} user={user} onLogout={logout} profile={profile} />; break;
      case 'editClass':
        screen = student && existingLog ? <LogClass student={student} nav={nav} saveClassLog={saveClassLog} existingLog={existingLog} />
                         : <Dashboard students={students} nav={nav} user={user} onLogout={logout} profile={profile} />; break;
      case 'share':
        screen = student ? <ShareScreen student={student} nav={nav} fromLog={route.meta?.fromLog} />
                         : <Dashboard students={students} nav={nav} user={user} onLogout={logout} profile={profile} />; break;
      case 'public':
        screen = <PublicProgress student={student || route.meta?.publicStudent || null} nav={user ? nav : undefined} />; break;
      default:
        screen = <Dashboard students={students} nav={nav} user={user} onLogout={logout} message={message} profile={profile} />;
    }
  }

  return (
    <div className="ct-shell" data-screen-label={`CourtTrack — ${route.name}`}>
      <div className="ct-stage">
        <div className="ct-brand-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12, background: '#0E1311',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.62 0.14 152)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M3.5 9c4 1 9-1 13.5-3"/>
                <path d="M20.5 15c-4-1-9 1-13.5 3"/>
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0 }}>CourtTrack</div>
          </div>
          <div className="ct-kicker">Para entrenadores de pádel</div>
          <h1 className="ct-brand-title">Reportes de progreso en 60 segundos</h1>
          <div className="ct-brand-copy">
            Después de cada clase, registra qué trabajaron, qué debe mejorar el alumno y qué tarea tiene para la semana.
          </div>
          <div className="ct-brand-value">
            Haz que tus alumnos vean progreso y se tomen más en serio sus clases.
          </div>
          <div className="ct-how">
            <div className="ct-how-label">Cómo funciona</div>
            <div className="ct-how-step"><span>1</span>Registra la clase</div>
            <div className="ct-how-step"><span>2</span>Añade corrección y tarea</div>
            <div className="ct-how-step"><span>3</span>Comparte el progreso con el alumno</div>
          </div>
          <div className="ct-brand-metrics">
            <div className="ct-brand-metric"><span>Seguimiento por alumno</span></div>
            <div className="ct-brand-metric"><span>Historial de clases guardado</span></div>
            <div className="ct-brand-metric"><span>Reporte listo para compartir</span></div>
          </div>
        </div>

        <IOSDevice width="min(390px, calc(100vw - 24px))" height="min(820px, calc(100svh - 28px))"
          time="9:41"
          dark={route.name === 'public'}
        >
          <div className="ct-scroll" style={{
            position: 'absolute', inset: 0, top: 66, overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}>
            {screen}
          </div>
        </IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

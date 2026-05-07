// CourtTrack data/auth service.
// Fill these for Supabase mode. When empty, the app uses localStorage so the MVP
// still works while the Supabase project is being created.
const CT_SUPABASE_URL = '';
const CT_SUPABASE_ANON_KEY = '';

const SCORE_FIELDS = [
  ['Derecha', 'forehand'],
  ['Revés', 'backhand'],
  ['Volea', 'volley'],
  ['Bandeja', 'bandeja'],
  ['Posicionamiento', 'positioning'],
  ['Toma de decisiones', 'decision_making'],
  ['Consistencia', 'consistency'],
  ['Confianza en partido', 'match_confidence'],
];

const emptyScores = () => SKILLS.reduce((acc, key) => ({ ...acc, [key]: 1 }), {});
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const nowIso = () => new Date().toISOString();

function scoresFromRow(row) {
  if (!row) return emptyScores();
  return SCORE_FIELDS.reduce((acc, [skill, field]) => ({ ...acc, [skill]: row[field] || 1 }), {});
}

function scoresToRow(scores) {
  return SCORE_FIELDS.reduce((acc, [skill, field]) => ({ ...acc, [field]: Number(scores?.[skill] || 1) }), {});
}

function parseImproved(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(value)];
  } catch {
    return String(value).split(',').map(v => v.trim()).filter(Boolean);
  }
}

function classFromRow(row) {
  return {
    id: row.id,
    date: row.date,
    type: row.class_type,
    focus: row.today_focus,
    improved: parseImproved(row.what_improved),
    correction: row.main_correction,
    homework: row.homework,
    nextFocus: row.next_focus,
    note: row.coach_note || '',
  };
}

function classToRow(log, studentId, coachId) {
  return {
    student_id: studentId,
    coach_id: coachId,
    date: log.date,
    class_type: log.type,
    today_focus: log.focus,
    what_improved: JSON.stringify(log.improved || []),
    main_correction: log.correction,
    homework: log.homework,
    next_focus: log.nextFocus,
    coach_note: log.note || '',
    updated_at: nowIso(),
  };
}

function studentFromRow(row, classes = [], scoreRow) {
  return {
    id: row.id,
    name: row.name,
    contact: row.email_or_phone || '',
    level: row.level || 'Intermedio',
    goal: row.main_goal || '',
    frequency: row.class_frequency || '1x / semana',
    startDate: row.start_date || '',
    scores: scoresFromRow(scoreRow),
    classes: [...classes].sort((a, b) => String(b.date).localeCompare(String(a.date))),
  };
}

function studentToRow(student, coachId) {
  return {
    coach_id: coachId,
    name: student.name,
    email_or_phone: student.contact || '',
    level: student.level,
    main_goal: student.goal || '',
    class_frequency: student.frequency,
    start_date: student.startDate || null,
    updated_at: nowIso(),
  };
}

const LocalBackend = {
  usersKey: 'courttrack.users.v1',
  sessionKey: 'courttrack.session.v1',
  dataKey: (coachId) => `courttrack.data.${coachId}.v1`,
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  async getSession() {
    const user = this.read(this.sessionKey, null);
    return { user };
  },
  async signUp(email, password) {
    const users = this.read(this.usersKey, []);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('Ya existe una cuenta con ese email.');
    const user = { id: uid(), email, password };
    this.write(this.usersKey, [...users, user]);
    this.write(this.sessionKey, { id: user.id, email: user.email });
    this.ensureData(user.id);
    return { user: { id: user.id, email: user.email } };
  },
  async signIn(email, password) {
    const user = this.read(this.usersKey, []).find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Email o contraseña incorrectos.');
    this.write(this.sessionKey, { id: user.id, email: user.email });
    this.ensureData(user.id);
    return { user: { id: user.id, email: user.email } };
  },
  async signOut() {
    localStorage.removeItem(this.sessionKey);
  },
  ensureData(coachId) {
    if (!localStorage.getItem(this.dataKey(coachId))) this.write(this.dataKey(coachId), { students: [] });
  },
  readData(coachId) {
    this.ensureData(coachId);
    return this.read(this.dataKey(coachId), { students: [] });
  },
  writeData(coachId, data) {
    this.write(this.dataKey(coachId), data);
  },
  async loadStudents(user) {
    return this.readData(user.id).students;
  },
  async createStudent(user, student) {
    const data = this.readData(user.id);
    const saved = { ...student, id: uid(), classes: [], scores: emptyScores() };
    this.writeData(user.id, { students: [saved, ...data.students] });
    return saved;
  },
  async updateStudent(user, studentId, patch) {
    const data = this.readData(user.id);
    let saved;
    const students = data.students.map(s => s.id === studentId ? (saved = { ...s, ...patch }) : s);
    this.writeData(user.id, { students });
    return saved;
  },
  async deleteStudent(user, studentId) {
    const data = this.readData(user.id);
    this.writeData(user.id, { students: data.students.filter(s => s.id !== studentId) });
  },
  async createClassLog(user, studentId, log) {
    const data = this.readData(user.id);
    const saved = { ...log, id: uid() };
    const students = data.students.map(s => s.id === studentId ? { ...s, classes: [saved, ...s.classes] } : s);
    this.writeData(user.id, { students });
    return saved;
  },
  async updateClassLog(user, studentId, logId, patch) {
    const data = this.readData(user.id);
    const students = data.students.map(s => s.id === studentId ? {
      ...s,
      classes: s.classes.map(c => c.id === logId ? { ...c, ...patch } : c).sort((a, b) => String(b.date).localeCompare(String(a.date))),
    } : s);
    this.writeData(user.id, { students });
  },
  async deleteClassLog(user, studentId, logId) {
    const data = this.readData(user.id);
    const students = data.students.map(s => s.id === studentId ? { ...s, classes: s.classes.filter(c => c.id !== logId) } : s);
    this.writeData(user.id, { students });
  },
  async updateScores(user, studentId, scores) {
    const data = this.readData(user.id);
    const students = data.students.map(s => s.id === studentId ? { ...s, scores } : s);
    this.writeData(user.id, { students });
  },
  async getPublicStudent(studentId) {
    const session = this.read(this.sessionKey, null);
    if (!session) return null;
    return this.readData(session.id).students.find(s => s.id === studentId) || null;
  },
};

function makeSupabaseBackend() {
  const client = window.supabase.createClient(CT_SUPABASE_URL, CT_SUPABASE_ANON_KEY);
  return {
    async getSession() {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      return { user: data.session?.user || null };
    },
    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;
      return { user: data.user };
    },
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user };
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
    async loadStudents(user) {
      const [studentsRes, logsRes, scoresRes] = await Promise.all([
        client.from('students').select('*').eq('coach_id', user.id).order('created_at', { ascending: false }),
        client.from('class_logs').select('*').eq('coach_id', user.id).order('date', { ascending: false }),
        client.from('progress_scores').select('*').eq('coach_id', user.id),
      ]);
      if (studentsRes.error) throw studentsRes.error;
      if (logsRes.error) throw logsRes.error;
      if (scoresRes.error) throw scoresRes.error;
      return studentsRes.data.map(row => studentFromRow(
        row,
        logsRes.data.filter(log => log.student_id === row.id).map(classFromRow),
        scoresRes.data.find(score => score.student_id === row.id)
      ));
    },
    async createStudent(user, student) {
      const { data, error } = await client.from('students').insert(studentToRow(student, user.id)).select('*').single();
      if (error) throw error;
      const { data: score, error: scoreError } = await client.from('progress_scores')
        .insert({ student_id: data.id, coach_id: user.id, ...scoresToRow(emptyScores()) })
        .select('*').single();
      if (scoreError) throw scoreError;
      return studentFromRow(data, [], score);
    },
    async updateStudent(user, studentId, patch) {
      const { data, error } = await client.from('students')
        .update(studentToRow(patch, user.id)).eq('id', studentId).eq('coach_id', user.id).select('*').single();
      if (error) throw error;
      return studentFromRow(data, patch.classes || [], { ...scoresToRow(patch.scores), student_id: studentId });
    },
    async deleteStudent(user, studentId) {
      const { error } = await client.from('students').delete().eq('id', studentId).eq('coach_id', user.id);
      if (error) throw error;
    },
    async createClassLog(user, studentId, log) {
      const { data, error } = await client.from('class_logs')
        .insert(classToRow(log, studentId, user.id)).select('*').single();
      if (error) throw error;
      return classFromRow(data);
    },
    async updateClassLog(user, studentId, logId, patch) {
      const { error } = await client.from('class_logs')
        .update(classToRow(patch, studentId, user.id)).eq('id', logId).eq('coach_id', user.id);
      if (error) throw error;
    },
    async deleteClassLog(user, studentId, logId) {
      const { error } = await client.from('class_logs').delete().eq('id', logId).eq('coach_id', user.id).eq('student_id', studentId);
      if (error) throw error;
    },
    async updateScores(user, studentId, scores) {
      const { error } = await client.from('progress_scores')
        .update({ ...scoresToRow(scores), updated_at: nowIso() }).eq('student_id', studentId).eq('coach_id', user.id);
      if (error) throw error;
    },
    async getPublicStudent(studentId) {
      const { data, error } = await client.rpc('get_public_student', { public_student_id: studentId });
      if (error) throw error;
      if (!data?.student) return null;
      return studentFromRow(
        data.student,
        (data.class_logs || []).map(classFromRow),
        data.progress_score
      );
    },
  };
}

function createCourtTrackStore() {
  const configured = CT_SUPABASE_URL && CT_SUPABASE_ANON_KEY && window.supabase;
  return configured ? makeSupabaseBackend() : LocalBackend;
}

Object.assign(window, {
  CT_SUPABASE_URL,
  CT_SUPABASE_ANON_KEY,
  createCourtTrackStore,
  emptyScores,
});

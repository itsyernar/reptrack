const STORAGE_KEY = "reptrack-data-v1";
  const DATA_VERSION = 4;

  const DEFAULT_TEMPLATES = [
    {
      id: "push",
      name: "Chest + Triceps",
      day: "Tuesday",
      exercises: [
        { name: "Wide Chest Press", category: "Chest" },
        { name: "Incline Dumbbell Press", category: "Chest" },
        { name: "Cable Fly", category: "Chest" },
        { name: "Dumbbell Pullover", category: "Chest" },
        { name: "Triceps Pushdown", category: "Triceps" },
        { name: "Overhead Cable Triceps Extension", category: "Triceps" },
        { name: "Overhead Dumbbell Triceps Extension", category: "Triceps" }
      ]
    },
    {
      id: "legs",
      name: "Legs + Shoulders",
      day: "Thursday",
      exercises: [
        { name: "Back Squat", category: "Legs" },
        { name: "Romanian Deadlift (Barbell)", category: "Legs" },
        { name: "Leg Extension", category: "Legs" },
        { name: "Leg Press", category: "Legs" },
        { name: "Bulgarian Split Squat", category: "Legs" },
        { name: "Standing Calf Extension", category: "Legs" },
        { name: "Dumbbell Shoulder Press", category: "Shoulders" },
        { name: "Lateral Raise", category: "Shoulders" },
        { name: "Rear Delt Fly", category: "Shoulders" }
      ]
    },
    {
      id: "pull",
      name: "Back + Biceps",
      day: "Saturday",
      exercises: [
        { name: "Lat Pulldown", category: "Back" },
        { name: "Seated Row", category: "Back" },
        { name: "Low Row", category: "Back" },
        { name: "Barbell Row", category: "Back" },
        { name: "Weighted Pull-Up", category: "Back" },
        { name: "Spider Curl", category: "Biceps" },
        { name: "Hammer Curl", category: "Biceps" },
        { name: "Brachialis Curl", category: "Biceps" }
      ]
    }
  ];

  const DEFAULT_REFERENCE_PRS = [
    { name: "Wide Chest Press", category: "Chest", weight: 30 },
    { name: "Incline Dumbbell Press", category: "Chest", weight: 20 },
    { name: "Cable Fly", category: "Chest", weight: 12.5 },
    { name: "Triceps Pushdown", category: "Triceps", weight: 27.5 },
    { name: "Overhead Cable Triceps Extension", category: "Triceps", weight: 12.5 },
    { name: "Lat Pulldown", category: "Back", weight: 50 },
    { name: "Seated Row", category: "Back", weight: 77.5 },
    { name: "Low Row", category: "Back", weight: 55 },
    { name: "Weighted Pull-Up", category: "Back", weight: 11.25 },
    { name: "Dumbbell Shoulder Press", category: "Shoulders", weight: 14 },
    { name: "Lateral Raise", category: "Shoulders", weight: 12 },
    { name: "Back Squat", category: "Legs", weight: 20 },
    { name: "Leg Press", category: "Legs", weight: 85 },
    { name: "Leg Extension", category: "Legs", weight: 35 }
  ];

  const DEFAULT_DATA = {
    version: DATA_VERSION,
    settings: { unit: "kg", defaultSets: 3, language: "en", theme: "light", restSeconds: 180 },
    templates: DEFAULT_TEMPLATES,
    referencePRs: DEFAULT_REFERENCE_PRS,
    workouts: [],
    bodyweight: [],
    activeWorkout: null
  };

  const TEXT = {
    en: {
      simpleTracker: "Simple workout tracker",
      homeTitle: "Train. Log. Progress.",
      start: "Start",
      thisWeek: "workouts this week",
      volume: "kg volume",
      recent: "Recent",
      workout: "Workout",
      workoutSub: "Only what you need while training.",
      progress: "Progress",
      progressSub: "Strength trend and workout history.",
      exercise: "Exercise",
      best: "Best",
      latest: "Latest",
      change: "Change",
      history: "History",
      more: "More",
      moreSub: "Preferences and backup.",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      unit: "Unit",
      sets: "Default sets",
      save: "Save",
      backup: "Backup & data",
      export: "Export",
      import: "Import",
      clear: "Clear data",
      home: "Home",
      today: "Today",
      next: "Next",
      noRecent: "No workouts yet.",
      chooseWorkout: "Choose workout",
      chooseWorkoutSub: "Tap one routine and start.",
      live: "Live workout",
      pause: "Pause",
      resume: "Resume",
      cancel: "Cancel",
      saveWorkout: "Save workout",
      addExercise: "+ Exercise",
      addSet: "+ Set",
      overload: "Overload",
      readyOverload: "Ready +{n} kg",
      previous: "Previous",
      kg: "kg",
      reps: "reps",
      done: "Done",
      saved: "Workout saved",
      settingsSaved: "Settings saved",
      imported: "Data imported",
      exported: "Backup exported",
      cleared: "Data cleared",
      needSet: "Enter at least one set",
      confirmCancel: "Cancel this live workout?",
      confirmClear: "Clear all RepTrack data?",
      exerciseName: "Exercise name",
      muscleGroup: "Muscle group",
      noProgress: "Log this exercise to see progress.",
      sessions: "sessions",
      activeExists: "Continue your live workout",
      continue: "Continue",
      overloadApplied: "Overload selected",
      overloadRemoved: "Overload removed",
      invalidBackup: "That backup file could not be read"
    },
    ru: {
      simpleTracker: "Простой трекер тренировок",
      homeTitle: "Тренируйся. Записывай. Расти.",
      start: "Начать",
      thisWeek: "тренировок за неделю",
      volume: "кг объёма",
      recent: "Последние",
      workout: "Тренировка",
      workoutSub: "Только то, что нужно во время тренировки.",
      progress: "Прогресс",
      progressSub: "Сила и история тренировок.",
      exercise: "Упражнение",
      best: "Лучший",
      latest: "Последний",
      change: "Изменение",
      history: "История",
      more: "Ещё",
      moreSub: "Настройки и резервная копия.",
      language: "Язык",
      theme: "Тема",
      light: "Светлая",
      dark: "Тёмная",
      unit: "Ед. веса",
      sets: "Подходов по умолчанию",
      save: "Сохранить",
      backup: "Резервная копия",
      export: "Экспорт",
      import: "Импорт",
      clear: "Удалить данные",
      home: "Главная",
      today: "Сегодня",
      next: "Дальше",
      noRecent: "Тренировок пока нет.",
      chooseWorkout: "Выбери тренировку",
      chooseWorkoutSub: "Нажми на программу и начинай.",
      live: "Тренировка идёт",
      pause: "Пауза",
      resume: "Продолжить",
      cancel: "Отменить",
      saveWorkout: "Сохранить тренировку",
      addExercise: "+ Упражнение",
      addSet: "+ Подход",
      overload: "Перегруз",
      readyOverload: "Можно +{n} кг",
      previous: "Было",
      kg: "кг",
      reps: "повт.",
      done: "Готово",
      saved: "Тренировка сохранена",
      settingsSaved: "Настройки сохранены",
      imported: "Данные импортированы",
      exported: "Копия сохранена",
      cleared: "Данные удалены",
      needSet: "Заполни хотя бы один подход",
      confirmCancel: "Отменить текущую тренировку?",
      confirmClear: "Удалить все данные RepTrack?",
      exerciseName: "Название упражнения",
      muscleGroup: "Группа мышц",
      noProgress: "Запиши это упражнение, чтобы увидеть прогресс.",
      sessions: "тренировок",
      activeExists: "Продолжить текущую тренировку",
      continue: "Продолжить",
      overloadApplied: "Перегруз выбран",
      overloadRemoved: "Перегруз снят",
      invalidBackup: "Не удалось прочитать файл резервной копии"
    }
  };

  let data = loadData();
  let draft = data.activeWorkout ? normalizeDraft(data.activeWorkout) : null;
  let tick = null;
  let currentProgressExercise = "";

  const $ = id => document.getElementById(id);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const num = value => Number(value) || 0;
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const lang = () => data.settings.language === "ru" ? "ru" : "en";
  const t = (key, vars = {}) => {
    let out = TEXT[lang()][key] || TEXT.en[key] || key;
    Object.entries(vars).forEach(([k, v]) => out = out.replace(`{${k}}`, v));
    return out;
  };
  const todayISO = () => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const formatDate = iso => {
    if (!iso) return "";
    const d = new Date(`${iso}T12:00:00`);
    return new Intl.DateTimeFormat(lang() === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" }).format(d);
  };
  const dayName = date => new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const formatDuration = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const unit = () => data.settings.unit || "kg";

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return clone(DEFAULT_DATA);
      return {
        ...clone(DEFAULT_DATA),
        ...stored,
        version: DATA_VERSION,
        settings: { ...DEFAULT_DATA.settings, ...(stored.settings || {}) },
        templates: Array.isArray(stored.templates) && stored.templates.length ? stored.templates : clone(DEFAULT_TEMPLATES),
        referencePRs: Array.isArray(stored.referencePRs) && stored.referencePRs.length ? stored.referencePRs : clone(DEFAULT_REFERENCE_PRS),
        workouts: Array.isArray(stored.workouts) ? stored.workouts : [],
        bodyweight: Array.isArray(stored.bodyweight) ? stored.bodyweight : [],
        activeWorkout: stored.activeWorkout || null
      };
    } catch {
      return clone(DEFAULT_DATA);
    }
  }

  function persist() {
    data.version = DATA_VERSION;
    data.activeWorkout = draft ? clone(draft) : null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function normalizeDraft(value) {
    const d = clone(value);
    d.id ||= uid("workout");
    d.date ||= todayISO();
    d.startedAt ||= new Date().toISOString();
    d.pausedAt ||= null;
    d.pausedDurationMs = num(d.pausedDurationMs);
    d.exercises = (d.exercises || []).map(ex => ({
      id: ex.id || uid("exercise"),
      name: ex.name || "Exercise",
      category: ex.category || "Other",
      overloadSelected: Boolean(ex.overloadSelected ?? ex.overload),
      sets: (ex.sets || []).map(set => ({
        id: set.id || uid("set"),
        weight: set.weight ?? "",
        reps: set.reps ?? "",
        rir: set.rir ?? "",
        completed: Boolean(set.completed)
      }))
    }));
    return d;
  }

  function applyTheme() {
    document.documentElement.dataset.theme = data.settings.theme === "dark" ? "dark" : "light";
    $("themeColor").setAttribute("content", data.settings.theme === "dark" ? "#101311" : "#f5f6f5");
  }

  function applyLanguage() {
    document.documentElement.lang = lang();
    $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    renderAll();
  }

  function toast(message) {
    const el = $("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 1700);
  }

  function navigate(viewId) {
    $$(".view").forEach(v => v.classList.toggle("active", v.id === viewId));
    $$(".nav button").forEach(b => b.classList.toggle("active", b.dataset.view === viewId));
    if (viewId === "homeView") renderHome();
    if (viewId === "workoutView") renderWorkout();
    if (viewId === "progressView") renderProgress();
    if (viewId === "moreView") renderMore();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  function cleanWorkoutName(name) {
    return String(name || "Workout")
      .replace(/^Push\s*[·-]\s*/i, "")
      .replace(/^Pull\s*[·-]\s*/i, "");
  }

  function templateTitle(template) {
    if (!template) return "Workout";
    if (template.id === "push") return "Chest + Triceps";
    if (template.id === "pull") return "Back + Biceps";
    if (template.id === "legs") return "Legs + Shoulders";
    return cleanWorkoutName(template.name);
  }

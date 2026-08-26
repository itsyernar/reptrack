  function applyOverloadWeight(exercise) {
    const previous = lastExerciseEntry(exercise.name)?.exercise;
    if (!previous?.sets?.length) return;
    const increment = overloadIncrement(exercise.category);
    exercise.sets.forEach((set, index) => {
      const prevWeight = num(previous.sets[index]?.weight || previous.sets[0]?.weight);
      if (prevWeight) set.weight = String(prevWeight + increment);
    });
  }

  function addExercise() {
    const name = prompt(t("exerciseName"));
    if (!name?.trim()) return;
    const category = prompt(t("muscleGroup"), "Other")?.trim() || "Other";
    const setCount = Math.max(1, num(data.settings.defaultSets) || 3);
    draft.exercises.push({
      id: uid("exercise"),
      name: name.trim(),
      category,
      overloadSelected: false,
      sets: Array.from({ length: setCount }, () => ({ id: uid("set"), weight: "", reps: "", rir: "", completed: false }))
    });
    persist();
    renderWorkout();
  }

  function saveWorkout() {
    if (!draft) return;
    const exercises = draft.exercises.map(ex => ({
      ...ex,
      sets: (ex.sets || []).map(set => ({
        ...set,
        weight: num(set.weight),
        reps: num(set.reps),
        rir: num(set.rir),
        completed: Boolean(set.completed || (num(set.weight) && num(set.reps)))
      })).filter(set => set.weight > 0 && set.reps > 0)
    })).filter(ex => ex.sets.length);

    if (!exercises.length) return toast(t("needSet"));

    const saved = {
      ...clone(draft),
      exercises,
      duration: Math.max(1, Math.round(elapsedSeconds() / 60)),
      pausedAt: null,
      savedAt: new Date().toISOString()
    };
    data.workouts.push(saved);
    draft = null;
    persist();
    clearInterval(tick);
    toast(t("saved"));
    navigate("progressView");
  }

  function e1rm(weight, reps) {
    if (!weight || !reps) return 0;
    return weight * (1 + reps / 30);
  }

  function progressSeries(name) {
    return recentWorkouts().slice().reverse().flatMap(workout => {
      const ex = (workout.exercises || []).find(x => x.name === name);
      if (!ex) return [];
      const best = Math.max(0, ...(ex.sets || []).map(set => e1rm(num(set.weight), num(set.reps))));
      if (!best) return [];
      return [{ date: workout.date, value: best }];
    });
  }

  function exerciseNames() {
    const names = new Set();
    (data.templates || []).forEach(tpl => (tpl.exercises || []).forEach(ex => names.add(ex.name)));
    (data.referencePRs || []).forEach(ex => names.add(ex.name));
    data.workouts.forEach(w => (w.exercises || []).forEach(ex => names.add(ex.name)));
    return [...names].sort((a,b) => a.localeCompare(b));
  }

  function renderProgress() {
    const select = $("progressExercise");
    const names = exerciseNames();
    const selected = currentProgressExercise && names.includes(currentProgressExercise)
      ? currentProgressExercise
      : (select.value && names.includes(select.value) ? select.value : names[0] || "");
    currentProgressExercise = selected;
    select.innerHTML = names.map(name => `<option value="${escapeAttr(name)}" ${name === selected ? "selected" : ""}>${escapeHtml(name)}</option>`).join("");
    select.onchange = () => {
      currentProgressExercise = select.value;
      renderProgressMetrics();
    };
    renderProgressMetrics();
    renderHistory();
  }

  function renderProgressMetrics() {
    const series = progressSeries(currentProgressExercise);
    if (!series.length) {
      $("progressBest").textContent = "—";
      $("progressLatest").textContent = "—";
      $("progressChange").textContent = "—";
      drawChart([]);
      return;
    }
    const best = Math.max(...series.map(x => x.value));
    const latest = series[series.length - 1].value;
    const first = series[0].value;
    const change = first ? ((latest - first) / first * 100) : 0;
    $("progressBest").textContent = `${best.toFixed(1)} ${unit()}`;
    $("progressLatest").textContent = `${latest.toFixed(1)} ${unit()}`;
    $("progressChange").textContent = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    drawChart(series);
  }

  function drawChart(series) {
    const canvas = $("progressCanvas");
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, Math.floor(rect.width * ratio));
    canvas.height = Math.floor(180 * ratio);
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    ctx.clearRect(0, 0, width, height);

    const styles = getComputedStyle(document.documentElement);
    const line = styles.getPropertyValue("--line").trim();
    const muted = styles.getPropertyValue("--muted").trim();
    const accent = styles.getPropertyValue("--accent").trim();

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = 18 + i * 36;
      ctx.beginPath(); ctx.moveTo(12, y); ctx.lineTo(width - 12, y); ctx.stroke();
    }

    if (!series.length) {
      ctx.fillStyle = muted;
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(t("noProgress"), width / 2, height / 2);
      return;
    }

    const values = series.map(x => x.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const left = 14, right = 14, top = 18, bottom = 20;
    const x = i => series.length === 1 ? width / 2 : left + (width - left - right) * i / (series.length - 1);
    const y = v => top + (height - top - bottom) * (1 - (v - min) / span);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    series.forEach((point, i) => i ? ctx.lineTo(x(i), y(point.value)) : ctx.moveTo(x(i), y(point.value)));
    ctx.stroke();

    ctx.fillStyle = accent;
    series.forEach((point, i) => {
      ctx.beginPath(); ctx.arc(x(i), y(point.value), 3.5, 0, Math.PI * 2); ctx.fill();
    });
  }

  function renderHistory() {
    const workouts = recentWorkouts().slice(0, 20);
    $("historyCount").textContent = `${workouts.length} ${t("sessions")}`;
    $("historyList").innerHTML = workouts.length ? workouts.map(w => `
      <details class="history-row">
        <summary>
          <div>
            <strong>${escapeHtml(cleanWorkoutName(w.name))}</strong>
            <small>${formatDate(w.date)} · ${num(w.duration)} min · ${Math.round(workoutVolume(w)).toLocaleString()} ${escapeHtml(unit())}</small>
          </div>
          <span class="chev">⌄</span>
        </summary>
        <div class="history-detail">
          ${(w.exercises || []).map(ex => `
            <div class="history-ex">
              <strong>${escapeHtml(ex.name)}${ex.overloadSelected ? ` <span class="flag">↗</span>` : ""}</strong>
              <small>${(ex.sets || []).map(set => `${num(set.weight)} ${escapeHtml(unit())} × ${num(set.reps)}`).join(" · ")}</small>
            </div>`).join("")}
        </div>
      </details>`).join("") : `<div class="card empty">${t("noRecent")}</div>`;
  }

  function renderMore() {
    $("languageSelect").value = lang();
    $("themeSelect").value = data.settings.theme || "light";
    $("unitSelect").value = data.settings.unit || "kg";
    $("defaultSets").value = String(data.settings.defaultSets || 3);
  }

  function renderAll() {
    applyTheme();
    renderHome();
    renderWorkout();
    renderProgress();
    renderMore();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[ch]));
  }
  function escapeAttr(value) { return escapeHtml(value); }

  $$(".nav button").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.view)));

  $("startToday").addEventListener("click", () => {
    if (draft) return navigate("workoutView");
    startWorkout(scheduledTemplateInfo().template);
  });

  $("quickTheme").addEventListener("click", () => {
    data.settings.theme = data.settings.theme === "dark" ? "light" : "dark";
    persist();
    applyTheme();
    drawChart(progressSeries(currentProgressExercise));
  });

  $("saveSettings").addEventListener("click", () => {
    data.settings.language = $("languageSelect").value;
    data.settings.theme = $("themeSelect").value;
    data.settings.unit = $("unitSelect").value;
    data.settings.defaultSets = num($("defaultSets").value) || 3;
    persist();
    applyLanguage();
    toast(t("settingsSaved"));
  });

  $("exportData").addEventListener("click", () => {
    persist();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reptrack-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(t("exported"));
  });

  $("importData").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const incoming = JSON.parse(await file.text());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
      data = loadData();
      draft = data.activeWorkout ? normalizeDraft(data.activeWorkout) : null;
      currentProgressExercise = "";
      applyLanguage();
      toast(t("imported"));
    } catch {
      toast(t("invalidBackup"));
    }
    event.target.value = "";
  });

  $("clearData").addEventListener("click", () => {
    if (!confirm(t("confirmClear"))) return;
    localStorage.removeItem(STORAGE_KEY);
    data = clone(DEFAULT_DATA);
    draft = null;
    currentProgressExercise = "";
    persist();
    applyLanguage();
    toast(t("cleared"));
  });

  window.addEventListener("resize", () => {
    if ($("progressView").classList.contains("active")) drawChart(progressSeries(currentProgressExercise));
  });

  applyLanguage();
  startTick();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
  }

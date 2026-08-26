  function scheduledTemplateInfo() {
    const now = new Date();
    const today = dayName(now);
    const exact = data.templates.find(x => x.day === today);
    if (exact) return { template: exact, label: t("today"), daysAway: 0 };

    const dayIndex = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
    const current = now.getDay();
    const ranked = data.templates.map(template => {
      const target = dayIndex[template.day] ?? current;
      let diff = (target - current + 7) % 7;
      if (diff === 0) diff = 7;
      return { template, diff };
    }).sort((a,b) => a.diff - b.diff);
    return { template: ranked[0]?.template || data.templates[0], label: t("next"), daysAway: ranked[0]?.diff || 0 };
  }

  function startOfWeek() {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - diff);
    return d;
  }

  function workoutVolume(workout) {
    return (workout.exercises || []).reduce((sum, ex) =>
      sum + (ex.sets || []).reduce((s, set) => s + num(set.weight) * num(set.reps), 0), 0);
  }

  function recentWorkouts() {
    return [...data.workouts].sort((a,b) => {
      const aKey = a.savedAt || `${a.date || ""}T00:00:00`;
      const bKey = b.savedAt || `${b.date || ""}T00:00:00`;
      return bKey.localeCompare(aKey);
    });
  }

  function renderHome() {
    const info = scheduledTemplateInfo();
    $("todayDay").textContent = `${info.label} · ${info.template?.day || ""}`;
    $("todayWorkout").textContent = draft ? t("activeExists") : templateTitle(info.template);
    $("todayMeta").textContent = draft
      ? `${cleanWorkoutName(draft.name)} · ${formatDuration(elapsedSeconds(draft))}`
      : `${info.template?.exercises?.length || 0} ${t("exercise").toLowerCase()}`;
    $("startToday").textContent = draft ? t("continue") : t("start");

    const weekStart = startOfWeek();
    const thisWeek = data.workouts.filter(w => new Date(`${w.date}T12:00:00`) >= weekStart);
    $("weekSessions").textContent = thisWeek.length;
    $("weekVolume").textContent = Math.round(thisWeek.reduce((sum, w) => sum + workoutVolume(w), 0)).toLocaleString();

    const recent = recentWorkouts().slice(0, 4);
    $("recentWorkouts").innerHTML = recent.length ? recent.map(w => `
      <div class="list-row">
        <div>
          <strong>${escapeHtml(cleanWorkoutName(w.name))}</strong>
          <small>${formatDate(w.date)} · ${Math.round(workoutVolume(w)).toLocaleString()} ${escapeHtml(unit())}</small>
        </div>
        <span class="chev">›</span>
      </div>`).join("") : `<div class="card empty">${t("noRecent")}</div>`;
  }

  function lastExerciseEntry(name) {
    for (const workout of recentWorkouts()) {
      const ex = (workout.exercises || []).find(item => item.name === name);
      if (ex) return { workout, exercise: ex };
    }
    return null;
  }

  function referenceWeight(name) {
    return num((data.referencePRs || []).find(x => x.name === name)?.weight);
  }

  function overloadIncrement(category) {
    return category === "Legs" ? 5 : 2.5;
  }

  function isReadyForOverload(exercise) {
    const sets = (exercise?.sets || []).filter(s => num(s.weight) > 0 && num(s.reps) > 0);
    return sets.length >= 3 && sets.slice(0, 3).every(s => num(s.reps) >= 12);
  }

  function makeDraft(template) {
    const setCount = Math.max(1, num(data.settings.defaultSets) || 3);
    return {
      id: uid("workout"),
      templateId: template.id,
      name: templateTitle(template),
      date: todayISO(),
      startedAt: new Date().toISOString(),
      pausedAt: null,
      pausedDurationMs: 0,
      notes: "",
      exercises: (template.exercises || []).map(ex => {
        const previous = lastExerciseEntry(ex.name)?.exercise;
        const refWeight = referenceWeight(ex.name);
        return {
          id: uid("exercise"),
          name: ex.name,
          category: ex.category || "Other",
          overloadSelected: false,
          sets: Array.from({ length: setCount }, (_, index) => ({
            id: uid("set"),
            weight: previous?.sets?.[index]?.weight ?? previous?.sets?.[0]?.weight ?? (refWeight || ""),
            reps: "",
            rir: "",
            completed: false
          }))
        };
      })
    };
  }

  function startWorkout(template) {
    if (!template) return;
    if (draft && !confirm(t("confirmCancel"))) return;
    draft = makeDraft(template);
    persist();
    navigate("workoutView");
    startTick();
  }

  function elapsedSeconds(d = draft) {
    if (!d?.startedAt) return 0;
    const start = new Date(d.startedAt).getTime();
    const end = d.pausedAt ? new Date(d.pausedAt).getTime() : Date.now();
    return Math.max(0, Math.floor((end - start - num(d.pausedDurationMs)) / 1000));
  }

  function startTick() {
    clearInterval(tick);
    if (!draft) return;
    tick = setInterval(() => {
      const timer = $("liveTimer");
      if (timer) timer.textContent = formatDuration(elapsedSeconds());
    }, 1000);
  }

  function togglePause() {
    if (!draft) return;
    if (draft.pausedAt) {
      draft.pausedDurationMs += Date.now() - new Date(draft.pausedAt).getTime();
      draft.pausedAt = null;
    } else {
      draft.pausedAt = new Date().toISOString();
    }
    persist();
    renderWorkout();
  }

  function workoutProgress() {
    const sets = draft?.exercises?.flatMap(ex => ex.sets || []) || [];
    const done = sets.filter(s => s.completed).length;
    return { done, total: sets.length };
  }

  function renderWorkout() {
    const root = $("workoutRoot");
    if (!draft) {
      root.innerHTML = `
        <div class="card">
          <div class="eyebrow">${t("chooseWorkout")}</div>
          <div class="starter">
            ${(data.templates || []).map(template => `
              <button class="btn" type="button" data-start-template="${escapeAttr(template.id)}">
                <strong>${escapeHtml(templateTitle(template))}</strong>
                <span>${escapeHtml(template.day || "")}</span>
              </button>`).join("")}
          </div>
        </div>`;
      root.querySelectorAll("[data-start-template]").forEach(btn => {
        btn.addEventListener("click", () => startWorkout(data.templates.find(x => x.id === btn.dataset.startTemplate)));
      });
      clearInterval(tick);
      return;
    }

    const progress = workoutProgress();
    const percentage = progress.total ? Math.round(progress.done / progress.total * 100) : 0;
    root.innerHTML = `
      <div class="live ${draft.pausedAt ? "paused" : ""}">
        <div class="live-top">
          <div class="live-title">
            <small><span class="dot"></span>${t("live")}</small>
            <strong>${escapeHtml(cleanWorkoutName(draft.name))}</strong>
          </div>
          <div class="live-actions">
            <span id="liveTimer" class="timer">${formatDuration(elapsedSeconds())}</span>
            <button id="pauseWorkout" class="btn btn-small" type="button">${draft.pausedAt ? t("resume") : t("pause")}</button>
          </div>
        </div>
        <div class="progress-track"><span style="width:${percentage}%"></span></div>
      </div>

      <div id="exerciseList">
        ${draft.exercises.map((exercise, index) => renderExercise(exercise, index)).join("")}
      </div>

      <button id="addExercise" class="btn btn-plain" type="button" style="width:100%">${t("addExercise")}</button>

      <div class="workout-save">
        <button id="cancelWorkout" class="btn btn-plain" type="button">${t("cancel")}</button>
        <button id="saveWorkout" class="btn btn-primary" type="button">${t("saveWorkout")}</button>
      </div>`;

    bindWorkoutEvents();
    startTick();
  }

  function renderExercise(exercise, exerciseIndex) {
    const previous = lastExerciseEntry(exercise.name)?.exercise;
    const ready = isReadyForOverload(previous);
    const increment = overloadIncrement(exercise.category);
    const previousText = previous?.sets?.length
      ? `${t("previous")}: ${num(previous.sets[0].weight)} ${unit()} × ${num(previous.sets[0].reps)}`
      : "";
    return `
      <article class="exercise ${exercise.overloadSelected ? "overload-on" : ""}" data-exercise="${exerciseIndex}">
        <div class="exercise-head">
          <div>
            <strong>${escapeHtml(exercise.name)}</strong>
            <small>${escapeHtml(exercise.category || "Other")}${previousText ? ` · ${escapeHtml(previousText)}` : ""}${ready ? ` · ${escapeHtml(t("readyOverload", {n:increment}))}` : ""}</small>
          </div>
          <button class="overload" type="button" data-overload="${exerciseIndex}" aria-pressed="${exercise.overloadSelected ? "true" : "false"}">↗ ${t("overload")}</button>
        </div>
        <div class="set-head"><span></span><span>${unit()}</span><span>${t("reps")}</span><span></span></div>
        <div>
          ${(exercise.sets || []).map((set, setIndex) => `
            <div class="set-row">
              <span class="set-num">${setIndex + 1}</span>
              <input type="number" inputmode="decimal" min="0" step="0.25" value="${escapeAttr(set.weight)}" data-set-field="${exerciseIndex}:${setIndex}:weight" aria-label="${unit()}">
              <input type="number" inputmode="numeric" min="0" step="1" value="${escapeAttr(set.reps)}" data-set-field="${exerciseIndex}:${setIndex}:reps" aria-label="${t("reps")}">
              <button class="check ${set.completed ? "done" : ""}" type="button" data-check="${exerciseIndex}:${setIndex}" aria-label="${t("done")}">${set.completed ? "✓" : "○"}</button>
            </div>`).join("")}
        </div>
        <div class="exercise-foot">
          <button class="btn btn-small btn-plain" type="button" data-add-set="${exerciseIndex}">${t("addSet")}</button>
        </div>
      </article>`;
  }

  function bindWorkoutEvents() {
    $("pauseWorkout")?.addEventListener("click", togglePause);
    $("cancelWorkout")?.addEventListener("click", () => {
      if (!confirm(t("confirmCancel"))) return;
      draft = null;
      persist();
      renderWorkout();
    });
    $("saveWorkout")?.addEventListener("click", saveWorkout);
    $("addExercise")?.addEventListener("click", addExercise);

    $$("[data-set-field]").forEach(input => {
      input.addEventListener("input", () => {
        const [exI, setI, field] = input.dataset.setField.split(":");
        const set = draft.exercises[num(exI)]?.sets?.[num(setI)];
        if (!set) return;
        set[field] = input.value;
        if ((!set.weight || !set.reps) && set.completed) set.completed = false;
        persist();
      });
    });

    $$("[data-check]").forEach(btn => btn.addEventListener("click", () => {
      const [exI, setI] = btn.dataset.check.split(":").map(Number);
      const set = draft.exercises[exI]?.sets?.[setI];
      if (!set) return;
      if (!num(set.weight) || !num(set.reps)) return;
      set.completed = !set.completed;
      persist();
      renderWorkout();
    }));

    $$("[data-add-set]").forEach(btn => btn.addEventListener("click", () => {
      const ex = draft.exercises[num(btn.dataset.addSet)];
      if (!ex) return;
      const previous = ex.sets[ex.sets.length - 1] || {};
      ex.sets.push({ id: uid("set"), weight: previous.weight || "", reps: "", rir: "", completed: false });
      persist();
      renderWorkout();
    }));

    $$("[data-overload]").forEach(btn => btn.addEventListener("click", () => {
      const index = num(btn.dataset.overload);
      const ex = draft.exercises[index];
      if (!ex) return;
      ex.overloadSelected = !ex.overloadSelected;
      if (ex.overloadSelected) applyOverloadWeight(ex);
      persist();
      toast(ex.overloadSelected ? t("overloadApplied") : t("overloadRemoved"));
      renderWorkout();
    }));
  }

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTENCE.JS — Saves/restores everything (settings, results, locks, custom pools, sound
// preference, prompt history) to localStorage, so a refresh doesn't lose your place.
// ═══════════════════════════════════════════════════════════════════════════

        // ─── PERSISTENCE ────────────────────────────────────────────────────────────
        // Everything the user can change — settings, current results, locks, custom pools, and
        // prompt history — is saved to localStorage after each action, and restored on load, so a
        // refresh (or closing the tab) doesn't lose where you were.
        const STORAGE_KEY = 'gamePromptRoulette.state.v1';
        const STATE_VERSION = 1; // bump this whenever the shape of the saved state object changes

        // Reads and parses the persisted state. Returns null if there's nothing saved, storage is
        // unavailable (e.g. private browsing in some browsers), the saved data is corrupt, or it was
        // written by a different schema version — callers should fall back to defaults in any of
        // those cases rather than risk applying a mismatched shape.
        function loadPersistedState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (!parsed || parsed.version !== STATE_VERSION) return null;
                return parsed;
            } catch (e) { return null; }
        }

        // Writes the full current state to localStorage. Cheap enough to call after every
        // meaningful action rather than on a timer. Fails silently if storage is unavailable or full —
        // the app still works, it just won't remember state across a refresh.
        function saveState() {
            try {
                const counts = {};
                sectionKeys.forEach(k => {
                    const el = document.getElementById(`num${k.charAt(0).toUpperCase() + k.slice(1)}`);
                    counts[k] = el ? parseInt(el.value, 10) : 2;
                });
                const uncheckedPlain = {};
                sectionKeys.forEach(k => { uncheckedPlain[k] = Array.from(uncheckedItems[k]); });
                const state = {
                    version: STATE_VERSION,
                    masterData, uncheckedItems: uncheckedPlain,
                    enabledSections, counts,
                    currentResults, lockedState,
                    promptHistory, historyIndex,
                    soundEnabled
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (e) { /* storage unavailable/full — nothing to do, app still works without it */ }
        }

        // Applies a previously-saved state to the live app. Called once, on load, before the first
        // render — restores pools first (buildPoolPickers needs masterData/uncheckedItems in place),
        // then settings, then results/locks, then history, then renders everything without animating.
        function applyPersistedState(saved) {
            if (saved.masterData) masterData = saved.masterData;
            uncheckedItems = { mechanics: new Set(), themes: new Set(), components: new Set() };
            if (saved.uncheckedItems) sectionKeys.forEach(k => { (saved.uncheckedItems[k] || []).forEach(n => uncheckedItems[k].add(n)); });

            buildPoolPickers();

            if (saved.enabledSections) {
                sectionKeys.forEach(k => {
                    enabledSections[k] = !!saved.enabledSections[k];
                    const toggle = document.getElementById(`toggle-${k}`);
                    const row = document.getElementById(`row-${k}`);
                    if (toggle) toggle.checked = enabledSections[k];
                    if (row) row.classList.toggle('active', enabledSections[k]);
                });
            }
            if (saved.counts) {
                sectionKeys.forEach(k => {
                    const el = document.getElementById(`num${k.charAt(0).toUpperCase() + k.slice(1)}`);
                    if (el && saved.counts[k]) el.value = saved.counts[k];
                });
            }
            if (saved.currentResults) currentResults = saved.currentResults;
            if (saved.lockedState) lockedState = saved.lockedState;
            if (Array.isArray(saved.promptHistory)) promptHistory = saved.promptHistory;
            if (typeof saved.historyIndex === 'number') historyIndex = saved.historyIndex;
            if (typeof saved.soundEnabled === 'boolean') soundEnabled = saved.soundEnabled;

            clampNumberInputs();
            renderAllCards(false);
            generatePromptSentence();
            updateHistoryNavUI();
            updateSpinAvailability();
        }

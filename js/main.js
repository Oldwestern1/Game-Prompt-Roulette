// ═══════════════════════════════════════════════════════════════════════════
// MAIN.JS — Loads last. Wires up every remaining event listener (the ones that used to be
// inline onclick/onchange attributes) and kicks off the app once the page has loaded.
// ═══════════════════════════════════════════════════════════════════════════

        // Binds every control that used to have an inline onclick/onchange/oninput attribute in the
        // HTML, so all event wiring lives in one place and follows the same addEventListener pattern
        // as the rest of the app.
        function initStaticControls() {
            sectionKeys.forEach(key => {
                document.getElementById(`toggle-${key}`).addEventListener('change', () => updateRowState(key));
                document.getElementById(`search-${key}`).addEventListener('input', function () { filterPool(this); });
                // Re-validates the spin button (and persists) whenever a count input changes.
                document.getElementById(`num${key.charAt(0).toUpperCase() + key.slice(1)}`).addEventListener('change', () => { clampNumberInputs(); updateSpinAvailability(); saveState(); });
            });
            document.getElementById('spinBtn').addEventListener('click', startSpin);
            document.getElementById('copyBtn').addEventListener('click', copyPrompt);
            document.getElementById('historyPrevBtn').addEventListener('click', goToPrevPrompt);
            document.getElementById('historyNextBtn').addEventListener('click', goToNextPrompt);
            const resetBtn = document.getElementById('resetPoolsBtn');
            if (resetBtn) resetBtn.addEventListener('click', resetPoolsToDefaults);
        }

        // Kicks everything off once the page has fully loaded.
        document.addEventListener('DOMContentLoaded', async () => {
            await refreshIconSprite();
            const saved = loadPersistedState();
            if (saved) { applyPersistedState(saved); } else { buildPoolPickers(); }
            initStaticControls();
            initWallpaperSystem();
            initThemeToggle();
            initPromptNav();
            initSoundToggle();
            updateSpinAvailability();
        });

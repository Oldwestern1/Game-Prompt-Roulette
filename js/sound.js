// ═══════════════════════════════════════════════════════════════════════════
// SOUND.JS — The synthesized sound-effect system (Web Audio oscillators, no audio files) and
// the mute toggle in the top-right corner.
// ═══════════════════════════════════════════════════════════════════════════

        // Animates a card's text rapidly cycling through random values before landing on the final result.
        // Slows down gradually like a slot machine. Returns a Promise that resolves when done.
        // ─── SOUND SYSTEM ───────────────────────────────────────────────────────────
        // Short synthesized sound effects (Web Audio oscillators, no audio files to ship or license).
        // The AudioContext is created lazily on first use, since browsers block audio until a user
        // gesture anyway. Sound defaults on; the toggle in the top-right corner mutes it and that
        // preference is persisted like everything else. Every sound is quiet and short on purpose —
        // this should read as a light touch, not a game show.
        let audioCtx = null;

        let soundEnabled = true;

        function ensureAudioCtx() {
            if (!soundEnabled) return null;
            if (!audioCtx) {
                try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
                catch (e) { return null; }
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            return audioCtx;
        }

        // Plays one short envelope-shaped tone. `glideTo`, if given, bends the pitch across the
        // tone's duration (rising = brighter/positive, falling = softer/negative).
        function playTone({ freq = 440, duration = 0.08, type = 'sine', gain = 0.12, glideTo = null, delay = 0 }) {
            const ctx = ensureAudioCtx();
            if (!ctx) return;
            const t0 = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, t0);
            if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
            gainNode.gain.setValueAtTime(0, t0);
            gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.008);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
            osc.connect(gainNode); gainNode.connect(ctx.destination);
            osc.start(t0); osc.stop(t0 + duration + 0.02);
        }

        const SoundFX = {
            tick()       { playTone({ freq: 700 + Math.random() * 120, duration: 0.035, type: 'square', gain: 0.045 }); },
            diceTick()   { playTone({ freq: 220 + Math.random() * 60, duration: 0.03, type: 'triangle', gain: 0.06 }); },
            land()       { playTone({ freq: 500, duration: 0.12, type: 'sine', gain: 0.13, glideTo: 720 }); },
            lockOn()     { playTone({ freq: 600, duration: 0.06, type: 'sine', gain: 0.1, glideTo: 460 }); },
            lockOff()    { playTone({ freq: 460, duration: 0.05, type: 'sine', gain: 0.08, glideTo: 620 }); },
            copy()       { playTone({ freq: 880, duration: 0.08, type: 'sine', gain: 0.11 }); playTone({ freq: 1180, duration: 0.09, type: 'sine', gain: 0.09, delay: 0.05 }); },
            addItem()    { playTone({ freq: 500, duration: 0.07, type: 'sine', gain: 0.09, glideTo: 760 }); },
            removeItem() { playTone({ freq: 620, duration: 0.07, type: 'sine', gain: 0.07, glideTo: 340 }); },
            whoosh()     { playTone({ freq: 320, duration: 0.13, type: 'sawtooth', gain: 0.045, glideTo: 130 }); },
            bump()       { playTone({ freq: 140, duration: 0.06, type: 'sine', gain: 0.08 }); },
        };

        // Wires up the top-right sound toggle: restores the persisted preference, updates its
        // icon/aria state, and flips `soundEnabled` (which every SoundFX call checks) on click.
        function initSoundToggle() {
            const btn = document.getElementById('soundToggle');
            const iconUse = document.getElementById('soundToggleIcon');
            if (!btn) return;
            function render() {
                if (iconUse) iconUse.setAttribute('href', soundEnabled ? '#icon-sound-on' : '#icon-sound-off');
                btn.classList.toggle('muted', !soundEnabled);
                btn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
            }
            render();
            btn.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                render();
                if (soundEnabled) SoundFX.copy(); // quick audible confirmation that sound is back on
                saveState();
            });
        }

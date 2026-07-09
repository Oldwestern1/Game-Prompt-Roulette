// ═══════════════════════════════════════════════════════════════════════════
// SOUND.JS — The synthesized sound-effect system (Web Audio oscillators, no audio files) and
// the mute toggle in the top-right corner.
// ═══════════════════════════════════════════════════════════════════════════

        // ─── SOUND SYSTEM ───────────────────────────────────────────────────────────
        // Most sounds here are short synthesized tones (Web Audio oscillators). The one exception is
        // the tick, which plays a real recorded click (audio/tick.wav) — a synthesized click didn't
        // sound as good as an actual sample. The AudioContext is created lazily on first use, since
        // browsers block audio until a user gesture anyway. Sound defaults on; the toggle in the
        // top-right corner mutes it and that preference is persisted like everything else.
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

        // Lazily fetches and decodes the real click sample, caching the result so it's only
        // fetched/decoded once no matter how many ticks play.
        let tickBufferPromise = null;
        function getTickBuffer(ctx) {
            if (!tickBufferPromise) {
                tickBufferPromise = fetch('audio/tick.wav')
                    .then(res => res.arrayBuffer())
                    .then(bytes => ctx.decodeAudioData(bytes));
            }
            return tickBufferPromise;
        }

        // Plays the real click sample once.
        async function playTickSample() {
            const ctx = ensureAudioCtx();
            if (!ctx) return;
            try {
                const buffer = await getTickBuffer(ctx);
                const src = ctx.createBufferSource(); src.buffer = buffer;
                const gain = ctx.createGain(); gain.gain.value = 0.85;
                src.connect(gain); gain.connect(ctx.destination);
                src.start();
            } catch (e) { /* fetch blocked (e.g. file:// origin) or decode failed — silently skip */ }
        }

        // A punchy, louder landing thud — layers a low body (the actual "thud") with a very short
        // higher-pitched attack transient on top. Pure low-frequency tones read as quiet-to-inaudible
        // on small/laptop speakers even at high gain, since bass is both perceptually weaker and
        // physically harder for small drivers to reproduce; the short high layer gives it presence
        // and an attack so it actually cuts through, regardless of speaker.
        function playLandThud() {
            const ctx = ensureAudioCtx();
            if (!ctx) return;
            const t0 = ctx.currentTime;
            const body = ctx.createOscillator(); const bodyGain = ctx.createGain();
            body.type = 'sine';
            body.frequency.setValueAtTime(210, t0);
            body.frequency.exponentialRampToValueAtTime(85, t0 + 0.22);
            bodyGain.gain.setValueAtTime(0, t0);
            bodyGain.gain.linearRampToValueAtTime(0.6, t0 + 0.008);
            bodyGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
            body.connect(bodyGain); bodyGain.connect(ctx.destination);
            body.start(t0); body.stop(t0 + 0.32);

            const attack = ctx.createOscillator(); const attackGain = ctx.createGain();
            attack.type = 'triangle'; attack.frequency.setValueAtTime(650, t0);
            attackGain.gain.setValueAtTime(0, t0);
            attackGain.gain.linearRampToValueAtTime(0.3, t0 + 0.004);
            attackGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
            attack.connect(attackGain); attackGain.connect(ctx.destination);
            attack.start(t0); attack.stop(t0 + 0.06);
        }

        // ─── SHARED TICK LOOP ───────────────────────────────────────────────────────
        // Previously, every card played its own tick sound on its own random schedule — with several
        // cards spinning at once, that meant several overlapping, out-of-sync tick streams. Instead,
        // there's a single tick loop: it starts the moment "Hit Me!" (or a single reroll) is pressed,
        // keeps ticking on its own steady accelerate-then-decelerate schedule, and is explicitly
        // stopped — with the landing thud — only once the actual last card has finished animating.
        // That keeps the sound honest to what's actually happening on screen, how ever long it takes.
        let tickLoopActive = false;
        let tickLoopTimer = null;

        function startTickLoop() {
            tickLoopActive = true;
            let delay = 50;
            const startedAt = (typeof performance !== 'undefined') ? performance.now() : Date.now();
            function loop() {
                if (!tickLoopActive) return;
                playTickSample();
                const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
                const elapsed = now - startedAt;
                // Ticks quickly at first; the longer the loop has been running, the more it eases off —
                // so a roll that happens to take a while still feels like it's winding down, not stuck.
                const growth = elapsed < 900 ? 1.045 : 1.11;
                delay = Math.min(delay * growth, 260);
                tickLoopTimer = setTimeout(loop, delay);
            }
            loop();
        }

        function stopTickLoopAndLand() {
            tickLoopActive = false;
            if (tickLoopTimer) { clearTimeout(tickLoopTimer); tickLoopTimer = null; }
            playLandThud();
        }

        const SoundFX = {
            startTickLoop,
            stopTickLoopAndLand,
            diceTick()   { playTone({ freq: 220 + Math.random() * 60, duration: 0.03, type: 'triangle', gain: 0.06 }); },
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

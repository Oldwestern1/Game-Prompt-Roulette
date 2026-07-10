// ═══════════════════════════════════════════════════════════════════════════
// SOUND.JS — The sound-effect system (a mix of Web Audio oscillator tones and real recorded
// samples) and the mute toggle in the top-right corner.
// ═══════════════════════════════════════════════════════════════════════════

        // ─── SOUND SYSTEM ───────────────────────────────────────────────────────────
        // A mix of short synthesized tones (Web Audio oscillators) and real recorded samples.
        // Samples are used wherever a physical, textured sound reads better than a synthesized
        // blip — the tick (audio/tick.wav), the landing thud (audio/land-thud.mp3), the lock
        // click (audio/lock-click.mp3), the prompt-card whoosh (audio/whoosh.mp3), the copy
        // confirmation chime (audio/copy-chime.mp3), a generic button press (audio/button-press.mp3)
        // used for add/remove item, the section toggles, the theme switch, and wallpaper cycling,
        // and an error sound (audio/error.mp3) used for the end-of-history bump and any other
        // "that action isn't valid" feedback (e.g. trying to add a duplicate pool item). Only dice
        // tick remains a synthesized tone — it's a minor, frequent micro-interaction where a quick
        // pitched blip is enough. The AudioContext is created lazily on first use, since browsers
        // block audio until a user gesture anyway. Sound defaults on; the toggle in the top-right
        // corner mutes it and that preference is persisted like everything else.
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

        // ─── SAMPLE PLAYBACK ────────────────────────────────────────────────────────
        // Generic lazy-fetch-and-decode cache, shared by every real audio sample in the app
        // (tick, land thud, lock click, whoosh, copy chime). Each URL is only ever fetched/decoded
        // once no matter how many times it's played — subsequent calls reuse the same decoded buffer.
        const sampleBufferPromises = {};
        function getSampleBuffer(ctx, url) {
            if (!sampleBufferPromises[url]) {
                sampleBufferPromises[url] = fetch(url)
                    .then(res => res.arrayBuffer())
                    .then(bytes => ctx.decodeAudioData(bytes))
                    .catch(e => { delete sampleBufferPromises[url]; throw e; }); // allow a retry later on transient failure
            }
            return sampleBufferPromises[url];
        }

        // Plays a real audio sample once. `playbackRate` lets one file serve slightly different
        // roles (e.g. a lock click at a lower rate for "unlock" vs. its normal rate for "lock").
        async function playSample(url, { gain = 0.85, playbackRate = 1 } = {}) {
            const ctx = ensureAudioCtx();
            if (!ctx) return;
            try {
                const buffer = await getSampleBuffer(ctx, url);
                const src = ctx.createBufferSource(); src.buffer = buffer; src.playbackRate.value = playbackRate;
                const gainNode = ctx.createGain(); gainNode.gain.value = gain;
                src.connect(gainNode); gainNode.connect(ctx.destination);
                src.start();
            } catch (e) { /* fetch blocked (e.g. file:// origin) or decode failed — silently skip */ }
        }

        // Plays the real click sample once (the roulette tick).
        function playTickSample() { playSample('audio/tick.wav', { gain: 0.85 }); }

        // The landing thud — a real recorded mechanical stop, played the instant the tick loop ends.
        // Gain is lower than you'd guess from the other samples' values because this source file is
        // mastered much hotter (higher mean volume) than the others — 0.55 here lands at roughly the
        // same perceived loudness as the other sample-based sounds, not quieter.
        function playLandThud() { playSample('audio/land-thud.mp3', { gain: 0.55 }); }

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
            // Same lock-click sample for both states, played at a slightly higher rate for "on" (a
            // crisper, more decisive click) and a slightly lower rate for "off" (a softer release).
            lockOn()     { playSample('audio/lock-click.mp3', { gain: 0.8, playbackRate: 1.08 }); },
            lockOff()    { playSample('audio/lock-click.mp3', { gain: 0.65, playbackRate: 0.85 }); },
            // The copy-chime source file is mastered very hot (peaks at 0dB) compared to the other
            // samples, so it needs a much lower gain to land at a comparable perceived loudness.
            copy()       { playSample('audio/copy-chime.mp3', { gain: 0.18 }); },
            // Add/remove custom pool items and the whole-category select-all checkbox — a real
            // button press, played at a slightly higher rate for the "positive" action (add/select)
            // and a slightly lower rate for the "negative" one (remove/deselect), same trick as lockOn/lockOff.
            addItem()    { playSample('audio/button-press.mp3', { gain: 0.8, playbackRate: 1.1 }); },
            removeItem() { playSample('audio/button-press.mp3', { gain: 0.7, playbackRate: 0.85 }); },
            whoosh()     { playSample('audio/whoosh.mp3', { gain: 1.0 }); },
            // A low body tone plus a very short higher-pitched attack layered on top — pure low
            // tones read as quiet-to-inaudible on small/laptop speakers even at high gain, so the
            // attack layer gives it presence and punch regardless of speaker (same fix originally
            // used for the old synthesized landing thud).
            error()      { playSample('audio/error.mp3', { gain: 0.15 }); },
            bump()       { SoundFX.error(); },
            // Section toggle switches — same button-press sample as add/remove item, same
            // higher/lower playbackRate convention for on vs. off.
            sectionOn()  { playSample('audio/button-press.mp3', { gain: 0.8, playbackRate: 1.1 }); },
            sectionOff() { playSample('audio/button-press.mp3', { gain: 0.7, playbackRate: 0.85 }); },
            // "Reset pools to defaults" is the one genuinely destructive action in the app (it's
            // gated behind a confirm() already) — a deliberate two-tone descending cue, distinct
            // from copy()'s ascending chime, so it reads as "done, and note this happened" rather
            // than a routine success blip.
            resetPools() {
                playTone({ freq: 760, duration: 0.09, type: 'sine', gain: 0.15 });
                playTone({ freq: 380, duration: 0.14, type: 'sine', gain: 0.15, delay: 0.09 });
            },
            // Light/dark mode switch and wallpaper cycling — both plain UI clicks, same button-press sample.
            themeSwitch() { playSample('audio/button-press.mp3', { gain: 0.75 }); },
            wallpaperCycle() { playSample('audio/button-press.mp3', { gain: 0.65 }); },
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

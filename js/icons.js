// ═══════════════════════════════════════════════════════════════════════════
// ICONS.JS — The inline-SVG icon helper, the icons/*.svg live-reload system, and the header
// dice roll animation (which just cycles through the same icon set).
// ═══════════════════════════════════════════════════════════════════════════

        // Builds the markup for an inline icon that references a <symbol> from the SVG sprite in index.html.
        // Using <use> (rather than <img>) means the icon's fill inherits `currentColor`, so it automatically
        // matches whatever color the surrounding button/text is styled with — including theme and hover changes.
        function iconSVG(id) {
            return `<svg class="icon" aria-hidden="true"><use href="#icon-${id}"></use></svg>`;
        }

        // ─── LIVE ICON LOADING ──────────────────────────────────────────────────────
        // The <symbol> definitions baked into the sprite (#iconSprite, top of index.html) are a
        // fallback — they're what shows up if this page is opened directly as a local file, where
        // browsers block fetch() for security reasons. When served over http(s) (GitHub Pages, a
        // local dev server, etc.), this fetches each icon's actual file from icons/ and refreshes
        // the matching <symbol> in place. That means editing a file in icons/ and reloading the page
        // is enough — nothing needs to be copied into index.html by hand.
        const ICON_FILES = ['dice-one', 'dice-two', 'dice-three', 'dice-four', 'dice-five', 'dice-six', 'pin', 'reroll-arrow', 'sound-on', 'sound-off'];

        async function refreshIconSprite() {
            const sprite = document.getElementById('iconSprite');
            if (!sprite) return;
            await Promise.all(ICON_FILES.map(async name => {
                try {
                    const res = await fetch(`icons/${name}.svg`);
                    if (!res.ok) return;
                    const text = await res.text();
                    const parsed = new DOMParser().parseFromString(text, 'image/svg+xml');
                    if (parsed.querySelector('parsererror')) return;
                    const svgEl = parsed.querySelector('svg');
                    if (!svgEl) return;
                    const viewBox = svgEl.getAttribute('viewBox') || '0 0 24 24';

                    let symbol = document.getElementById(`icon-${name}`);
                    if (!symbol) {
                        symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
                        symbol.id = `icon-${name}`;
                        sprite.appendChild(symbol);
                    }
                    symbol.setAttribute('viewBox', viewBox);
                    symbol.innerHTML = svgEl.innerHTML;
                } catch (e) { /* fetch blocked (e.g. file:// origin) — the baked-in fallback symbol stays as-is */ }
            }));
        }

        // ─── HEADER DICE ROLL ───────────────────────────────────────────────────────
        // The two decorative dice next to the title tumble through random faces and land on a
        // fresh random face every time the user spins — a small nod to the "roulette" theme.
        const DIE_FACES = ['dice-one', 'dice-two', 'dice-three', 'dice-four', 'dice-five', 'dice-six'];

        // Animates a single header die: ticks through random faces, then settles on finalFace.
        // The delay between ticks follows a slow → fast → slow curve (via a sine easing on the
        // tick's position in the sequence) so the roll feels like it's winding up and settling down,
        // rather than ticking at a constant rate.
        function rollHeaderDie(svgEl, finalFace) {
            return new Promise(resolve => {
                const useEl = svgEl.querySelector('use');
                const ticks = 16;
                const minDelay = 45, maxDelay = 130;
                let i = 0;
                function nextTick() {
                    if (i >= ticks) {
                        useEl.setAttribute('href', `#icon-${finalFace}`);
                        svgEl.style.transform = 'rotate(0deg)';
                        resolve();
                        return;
                    }
                    const randomFace = DIE_FACES[Math.floor(Math.random() * DIE_FACES.length)];
                    useEl.setAttribute('href', `#icon-${randomFace}`);
                    svgEl.style.transform = `rotate(${(Math.random() * 16 - 8).toFixed(1)}deg)`;
                    SoundFX.diceTick();
                    i++;
                    const progress = i / ticks;
                    const delay = minDelay + (maxDelay - minDelay) * (1 - Math.sin(Math.PI * progress));
                    setTimeout(nextTick, delay);
                }
                nextTick();
            });
        }

        // Rolls both header dice to fresh random faces. Returns a promise so callers can wait for it,
        // but startSpin() fires it without awaiting so it doesn't hold up the actual result cards.
        function rollHeaderDice() {
            const dieLeft = document.getElementById('dieLeft');
            const dieRight = document.getElementById('dieRight');
            if (!dieLeft || !dieRight) return Promise.resolve();
            const faceLeft = DIE_FACES[Math.floor(Math.random() * DIE_FACES.length)];
            const faceRight = DIE_FACES[Math.floor(Math.random() * DIE_FACES.length)];
            return Promise.all([rollHeaderDie(dieLeft, faceLeft), rollHeaderDie(dieRight, faceRight)]);
        }

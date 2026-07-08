// ═══════════════════════════════════════════════════════════════════════════
// THEME.JS — Light/dark mode toggle and the generated SVG wallpaper system.
// ═══════════════════════════════════════════════════════════════════════════

        // Sets up the light/dark mode toggle button in the top-right corner.
        function initThemeToggle() {
            const btn = document.getElementById('modeToggle');
            applyMode(document.body.classList.contains('light-mode'));
            btn.addEventListener('click', () => {
                const willBeLight = !document.body.classList.contains('light-mode');
                document.body.classList.toggle('light-mode', willBeLight);
                applyMode(willBeLight);
            });
        }

        // Applies the chosen mode — swaps the button icon and refreshes the wallpaper colours.
        function applyMode(isLight) {
            const btn = document.getElementById('modeToggle');
            btn.innerHTML = isLight ? '&#9818;' : '&#9812;';
            btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
            if (typeof window.refreshWallpaper === 'function') window.refreshWallpaper();
        }

        // ─── WALLPAPER SYSTEM ───────────────────────────────────────────────────────
        // The decorative background pattern. Click the diamond button (bottom-right) to cycle styles,
        // hold it to turn the wallpaper off. Each entry describes a layout, glyph set, and colour mode.
        // To add a new style, just add another object to this array.
        const WALLPAPER_STYLES = [
            { label: 'Off', layout: 'none' },

            { label: 'Scatter: Playing Cards (All Colors)', layout: 'scatter', glyphs: GLYPHS.cards,         glyphKey: 'cards',   colorMode: 'three'   },
            { label: 'Scatter: Playing Cards (Neutral)',    layout: 'scatter', glyphs: GLYPHS.cards,         glyphKey: 'cards',   colorMode: 'neutral' },
            { label: 'Scatter: Outline Suits (2 Colors)',  layout: 'scatter', glyphs: GLYPHS.suits_outline,  glyphKey: 'suits',   colorMode: 'two'     },
            { label: 'Scatter: Outline Suits (Neutral)',   layout: 'scatter', glyphs: GLYPHS.suits_outline,  glyphKey: 'suits',   colorMode: 'neutral' },
            { label: 'Scatter: Solid Suits (Single)',      layout: 'scatter', glyphs: GLYPHS.suits_solid,    glyphKey: 'suits',   colorMode: 'single'  },
            { label: 'Scatter: Solid Suits (Neutral)',     layout: 'scatter', glyphs: GLYPHS.suits_solid,    glyphKey: 'suits',   colorMode: 'neutral' },
            { label: 'Scatter: Chess (All Colors)',        layout: 'scatter', glyphs: GLYPHS.chess,          glyphKey: 'chess',   colorMode: 'three'   },
            { label: 'Scatter: Chess (Neutral)',           layout: 'scatter', glyphs: GLYPHS.chess,          glyphKey: 'chess',   colorMode: 'neutral' },
            { label: 'Scatter: Dice (All Colors)',         layout: 'scatter', glyphs: GLYPHS.dice,           glyphKey: 'dice',    colorMode: 'three'   },
            { label: 'Scatter: Dice (Neutral)',            layout: 'scatter', glyphs: GLYPHS.dice,           glyphKey: 'dice',    colorMode: 'neutral' },
            { label: 'Scatter: Shapes (All Colors)',       layout: 'scatter', glyphs: GLYPHS.shapes,         glyphKey: 'shapes',  colorMode: 'three'   },
            { label: 'Scatter: Shapes (Neutral)',          layout: 'scatter', glyphs: GLYPHS.shapes,         glyphKey: 'shapes',  colorMode: 'neutral' },
            { label: 'Scatter: Blocks (2 Colors)',         layout: 'scatter', glyphs: GLYPHS.blocks,         glyphKey: 'blocks',  colorMode: 'two'     },
            { label: 'Scatter: Blocks (Neutral)',          layout: 'scatter', glyphs: GLYPHS.blocks,         glyphKey: 'blocks',  colorMode: 'neutral' },


            { label: 'Grid: Mixed Suits (All Colors)',     layout: 'grid', glyphs: [...GLYPHS.suits_outline, ...GLYPHS.suits_solid], glyphKey: 'suits',    colorMode: 'three'   },
            { label: 'Grid: Mixed Suits (Neutral)',        layout: 'grid', glyphs: [...GLYPHS.suits_outline, ...GLYPHS.suits_solid], glyphKey: 'suits',    colorMode: 'neutral' },
            { label: 'Grid: Solid Suits (Single)',         layout: 'grid', glyphs: GLYPHS.suits_solid,       glyphKey: 'suits',   colorMode: 'single'  },
            { label: 'Grid: Outline Suits (2 Colors)',     layout: 'grid', glyphs: GLYPHS.suits_outline,     glyphKey: 'suits',   colorMode: 'two'     },
            { label: 'Grid: Diamonds (2 Colors)',          layout: 'grid', glyphs: ['◈', '◆', '◇'],         glyphKey: 'shapes',  colorMode: 'two'     },
            { label: 'Grid: Diamonds (Neutral)',           layout: 'grid', glyphs: ['◈', '◆', '◇'],         glyphKey: 'shapes',  colorMode: 'neutral' },
            { label: 'Grid: Stars (2 Colors)',             layout: 'grid', glyphs: ['✦', '✧', '⟡'],        glyphKey: 'shapes',  colorMode: 'two'     },
            { label: 'Grid: Stars (Neutral)',              layout: 'grid', glyphs: ['✦', '✧', '⟡'],        glyphKey: 'shapes',  colorMode: 'neutral' },
            { label: 'Grid: Dice (All Colors)',            layout: 'grid', glyphs: GLYPHS.dice,              glyphKey: 'dice',    colorMode: 'three'   },
            { label: 'Grid: Dice (Neutral)',               layout: 'grid', glyphs: GLYPHS.dice,              glyphKey: 'dice',    colorMode: 'neutral' },
            { label: 'Grid: Chess (All Colors)',           layout: 'grid', glyphs: GLYPHS.chess,             glyphKey: 'chess',   colorMode: 'three'   },
            { label: 'Grid: Chess (Neutral)',              layout: 'grid', glyphs: GLYPHS.chess,             glyphKey: 'chess',   colorMode: 'neutral' },
            { label: 'Grid: Shapes (All Colors)',          layout: 'grid', glyphs: GLYPHS.shapes,            glyphKey: 'shapes',  colorMode: 'three'   },
            { label: 'Grid: Shapes (Neutral)',             layout: 'grid', glyphs: GLYPHS.shapes,            glyphKey: 'shapes',  colorMode: 'neutral' },

            { label: 'Fill: Suits (All Colors)',           layout: 'fill', glyphs: [...GLYPHS.suits_outline, ...GLYPHS.suits_solid], glyphKey: 'suits',  colorMode: 'three'   },
            { label: 'Fill: Suits (Neutral)',              layout: 'fill', glyphs: [...GLYPHS.suits_outline, ...GLYPHS.suits_solid], glyphKey: 'suits',  colorMode: 'neutral' },
            { label: 'Fill: Dice (All Colors)',            layout: 'fill', glyphs: GLYPHS.dice,              glyphKey: 'dice',    colorMode: 'three'   },
            { label: 'Fill: Dice (Neutral)',               layout: 'fill', glyphs: GLYPHS.dice,              glyphKey: 'dice',    colorMode: 'neutral' },
            { label: 'Fill: Chess (All Colors)',           layout: 'fill', glyphs: GLYPHS.chess,             glyphKey: 'chess',   colorMode: 'three'   },
            { label: 'Fill: Chess (Neutral)',              layout: 'fill', glyphs: GLYPHS.chess,             glyphKey: 'chess',   colorMode: 'neutral' },
            { label: 'Fill: Shapes (All Colors)',          layout: 'fill', glyphs: GLYPHS.shapes,            glyphKey: 'shapes',  colorMode: 'three'   },
            { label: 'Fill: Shapes (Neutral)',             layout: 'fill', glyphs: GLYPHS.shapes,            glyphKey: 'shapes',  colorMode: 'neutral' },
            { label: 'Fill: Playing Cards (All Colors)',   layout: 'fill', glyphs: GLYPHS.cards,             glyphKey: 'cards',   colorMode: 'three'   },
            { label: 'Fill: Playing Cards (Neutral)',      layout: 'fill', glyphs: GLYPHS.cards,             glyphKey: 'cards',   colorMode: 'neutral' },


            { label: 'Boxes: Thin (Single)',               layout: 'boxes', boxStyle: 'thin',    cellSize: 55,  colorMode: 'single'  },
            { label: 'Boxes: Thin (Neutral)',              layout: 'boxes', boxStyle: 'thin',    cellSize: 55,  colorMode: 'neutral' },
            { label: 'Boxes: Thick (Single)',              layout: 'boxes', boxStyle: 'thick',   cellSize: 70,  colorMode: 'single'  },
            { label: 'Boxes: Thick (Neutral)',             layout: 'boxes', boxStyle: 'thick',   cellSize: 70,  colorMode: 'neutral' },
            { label: 'Boxes: Double (Single)',             layout: 'boxes', boxStyle: 'double',  cellSize: 65,  colorMode: 'single'  },
            { label: 'Boxes: Double (Neutral)',            layout: 'boxes', boxStyle: 'double',  cellSize: 65,  colorMode: 'neutral' },
            { label: 'Boxes: Mixed Weight (All Colors)',   layout: 'boxes', boxStyle: 'mixed',   cellSize: 60,  colorMode: 'three'   },
            { label: 'Boxes: Mixed Weight (Neutral)',      layout: 'boxes', boxStyle: 'mixed',   cellSize: 60,  colorMode: 'neutral' },
            { label: 'Boxes: Rounded (All Colors)',        layout: 'boxes', boxStyle: 'rounded', cellSize: 65,  colorMode: 'three'   },
            { label: 'Boxes: Rounded (Neutral)',           layout: 'boxes', boxStyle: 'rounded', cellSize: 65,  colorMode: 'neutral' },
            { label: 'Boxes: Large Thin (Neutral)',        layout: 'boxes', boxStyle: 'thin',    cellSize: 100, colorMode: 'neutral' },
            { label: 'Boxes: Large Double (Single)',       layout: 'boxes', boxStyle: 'double',  cellSize: 100, colorMode: 'single'  },

            { label: 'Lines: Diagonal Thick (Single)',     layout: 'lined', lineDir: 'diag',      lineStyle: 'thick',  gap: 40,  colorMode: 'single'  },
            { label: 'Lines: Diagonal Double (Neutral)',   layout: 'lined', lineDir: 'diag',      lineStyle: 'double', gap: 32,  colorMode: 'neutral' },
        ];

        let wallpaperStyleIndex = 0; // which style is currently active

        // Simple pseudo-random number generator. Mixing in WALLPAPER_VARIANT means the same
        // style can look 6 different ways depending on which session variant was picked.
        function seededRandom(seed) {
            let s = seed;
            return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
        }

        // Generates an SVG tile for the current wallpaper style, then sets it as a repeating background.
        // Handles all layout types: scatter, grid, fill, boxes, lined.
        function buildWallpaperSVG(styleObj, isLight) {
            const neutralColor = isLight ? '#2b2620' : '#cfcfcf';
            const redColor    = isLight ? '#d9483a' : '#ff6b6b';
            const blueColor   = isLight ? '#3a7bbf' : '#4dadf7';
            const purpleColor = isLight ? '#8a6fc9' : '#a78bfa';
            const accentPalette = [redColor, blueColor, purpleColor];

            const neutralOpacity = isLight ? 0.26 : 0.24;
            const accentOpacity  = isLight ? 0.34 : 0.34;


            const rand = seededRandom(hashString(styleObj.label));

            const layout    = styleObj.layout;
            const glyphPool = styleObj.glyphs || [];
            const colorMode = styleObj.colorMode;
            const glyphKey  = styleObj.glyphKey || '';


            const shuffled = [...accentPalette];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            let palette;
            if      (colorMode === 'neutral') palette = [neutralColor];
            else if (colorMode === 'single')  palette = [shuffled[0]];
            else if (colorMode === 'two')     palette = [shuffled[0], shuffled[1]];
            else                              palette = [...accentPalette]; // 'three'

            function pickColor() {
                return palette[Math.floor(rand() * palette.length)];
            }
            function opacity(color) {
                return color === neutralColor ? neutralOpacity : accentOpacity;
            }
            function textNode(x, y, size, color, glyph, rotation) {
                const op = opacity(color).toFixed(2);
                const tx = x.toFixed(1), ty = y.toFixed(1);
                const rot = rotation ? ` transform='rotate(${rotation} ${tx} ${ty})'` : '';
                return `<text x='${tx}' y='${ty}' font-size='${size}' fill='${color}' opacity='${op}' ` +
                       `font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'${rot}>${glyph}</text>`;
            }

            const cells = [];
            let tileW, tileH;


            if (layout === 'scatter') {
                const cols = 4, rows = 5;
                const cellW = 240, cellH = 220;
                tileW = cols * cellW; tileH = rows * cellH;


                const isSmallGlyph = (glyphKey === 'blocks' || glyphKey === 'cards');

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (rand() < 0.28) continue;
                        const glyph    = glyphPool[Math.floor(rand() * glyphPool.length)];
                        const color    = pickColor();
                        const baseSize = isSmallGlyph
                            ? Math.round(55 + rand() * 30)
                            : Math.round(88 + rand() * 52);
                        const rotation = Math.round((rand() - 0.5) * 50);

                        const margin = Math.ceil(baseSize * 0.65);
                        const cellCx = c * cellW + cellW / 2;
                        const cellCy = r * cellH + cellH / 2;
                        const maxJitterX = Math.max(0, cellW / 2 - margin);
                        const maxJitterY = Math.max(0, cellH / 2 - margin);
                        const cx = Math.min(Math.max(cellCx + (rand() - 0.5) * 2 * maxJitterX, margin), tileW - margin);
                        const cy = Math.min(Math.max(cellCy + (rand() - 0.5) * 2 * maxJitterY, margin), tileH - margin);
                        cells.push(textNode(cx, cy, baseSize, color, glyph, rotation));
                    }
                }


            } else if (layout === 'boxes') {
                const cellW = styleObj.cellSize || 60;
                const cellH = styleObj.cellSize || 60;
                const cols = 12, rows = 10;
                tileW = cols * cellW; tileH = rows * cellH;

                const boxStyle  = styleObj.boxStyle  || 'thin';
                const fillCells = styleObj.fillCells !== false;


                const lineColor   = (colorMode === 'neutral') ? neutralColor : pickColor();
                const lineOpacity = (lineColor === neutralColor ? neutralOpacity : accentOpacity);


                const weights = {
                    thin:    { outer: 1.2, inner: 0.7 },
                    thick:   { outer: 3.5, inner: 2.0 },
                    double:  { outer: 1.0, inner: 1.0 },
                    mixed:   { outer: 2.5, inner: 1.0 },
                    rounded: { outer: 1.5, inner: 0.8 },
                };
                const w = weights[boxStyle] || weights.thin;


                const merged = new Set();
                const boxes  = [];

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (merged.has(`${r},${c}`)) continue;

                        const spanW = (c + 1 < cols && !merged.has(`${r},${c+1}`) && rand() < 0.25) ? 2 : 1;
                        const spanH = (r + 1 < rows && !merged.has(`${r+1},${c}`) && rand() < 0.20) ? 2 : 1;

                        for (let dr = 0; dr < spanH; dr++)
                            for (let dc = 0; dc < spanW; dc++)
                                merged.add(`${r+dr},${c+dc}`);
                        boxes.push({ r, c, bw: spanW, bh: spanH });
                    }
                }

                const lo = lineOpacity.toFixed(2);
                const fillOpacity = (lineOpacity * 0.12).toFixed(3);

                boxes.forEach(({ r, c, bw, bh }) => {
                    const x  = c * cellW,      y  = r * cellH;
                    const x2 = x + bw * cellW, y2 = y + bh * cellH;


                    if (fillCells && rand() < 0.40) {
                        const fc = (colorMode === 'neutral') ? neutralColor : pickColor();
                        cells.push(`<rect x='${x}' y='${y}' width='${bw*cellW}' height='${bh*cellH}' fill='${fc}' opacity='${fillOpacity}'/>`);
                    }

                    if (boxStyle === 'double') {

                        const gap = 4;
                        cells.push(`<rect x='${x+0.5}' y='${y+0.5}' width='${bw*cellW-1}' height='${bh*cellH-1}' fill='none' stroke='${lineColor}' stroke-width='${w.outer}' opacity='${lo}'/>`);
                        cells.push(`<rect x='${x+gap+0.5}' y='${y+gap+0.5}' width='${bw*cellW-gap*2-1}' height='${bh*cellH-gap*2-1}' fill='none' stroke='${lineColor}' stroke-width='${w.inner}' opacity='${lo}'/>`);
                    } else if (boxStyle === 'rounded') {
                        const rx = Math.min(10, cellW * 0.25);
                        cells.push(`<rect x='${x+1}' y='${y+1}' width='${bw*cellW-2}' height='${bh*cellH-2}' rx='${rx}' ry='${rx}' fill='none' stroke='${lineColor}' stroke-width='${w.outer}' opacity='${lo}'/>`);
                    } else {

                        const sw = (boxStyle === 'mixed' && rand() < 0.4) ? w.inner : w.outer;
                        cells.push(`<rect x='${x+0.5}' y='${y+0.5}' width='${bw*cellW-1}' height='${bh*cellH-1}' fill='none' stroke='${lineColor}' stroke-width='${sw}' opacity='${lo}'/>`);
                    }
                });


            } else if (layout === 'lined') {
                const lineDir   = styleObj.lineDir   || 'h';
                const lineStyle = styleObj.lineStyle  || 'thin';
                tileW = 200; tileH = 200;

                const lineColor   = (colorMode === 'neutral') ? neutralColor : pickColor();
                const lineOpacity = (lineColor === neutralColor ? neutralOpacity : accentOpacity);
                const lo = lineOpacity.toFixed(2);

                const gap = styleObj.gap || 28;
                const sw  = lineStyle === 'thick' ? 3 : lineStyle === 'double' ? 1.2 : 1;
                const dash = lineStyle === 'dashed' ? `stroke-dasharray='8 6'` : '';

                const addLine = (x1, y1, x2, y2, strokeW) => {
                    cells.push(`<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${lineColor}' stroke-width='${strokeW}' opacity='${lo}' ${dash}/>`);
                };

                if (lineDir === 'h' || lineDir === 'cross') {
                    for (let y = 0; y <= tileH; y += gap) {
                        addLine(0, y, tileW, y, sw);
                        if (lineStyle === 'double') addLine(0, y + 4, tileW, y + 4, sw * 0.7);
                    }
                }
                if (lineDir === 'v' || lineDir === 'cross') {
                    for (let x = 0; x <= tileW; x += gap) {
                        addLine(x, 0, x, tileH, sw);
                        if (lineStyle === 'double') addLine(x + 4, 0, x + 4, tileH, sw * 0.7);
                    }
                }
                if (lineDir === 'diag' || lineDir === 'diagcross') {
                    const step = gap;
                    for (let i = -tileH; i <= tileW + tileH; i += step) {
                        addLine(i, 0, i + tileH, tileH, sw);
                        if (lineStyle === 'double') addLine(i + 4, 0, i + 4 + tileH, tileH, sw * 0.7);
                    }
                }
                if (lineDir === 'diagcross') {
                    for (let i = -tileH; i <= tileW + tileH; i += gap) {
                        addLine(i + tileH, 0, i, tileH, sw);
                    }
                }

            } else if (layout === 'grid') {
                const cols = 6, rows = 6;
                const cellW = 140, cellH = 140;
                tileW = cols * cellW; tileH = rows * cellH;
                const baseSize = 68;

                for (let r = 0; r < rows; r++) {
                    const isStaggered = (r % 2 !== 0);
                    const itemsInRow = isStaggered ? cols + 1 : cols;
                    let firstGlyph, firstColor;

                    for (let c = 0; c < itemsInRow; c++) {
                        let glyph, color;

                        if (isStaggered && c === cols) {

                            glyph = firstGlyph;
                            color = firstColor;
                        } else {
                            glyph = glyphPool[Math.floor(rand() * glyphPool.length)];
                            color = pickColor();
                            if (c === 0) { firstGlyph = glyph; firstColor = color; }
                        }

                        const cx = isStaggered
                            ? c * cellW
                            : c * cellW + cellW / 2;
                        const cy = r * cellH + cellH / 2;
                        cells.push(textNode(cx, cy, baseSize, color, glyph, 0));
                    }
                }


            } else if (layout === 'fill') {
                const cols = 10, rows = 10;
                const cellW = 58, cellH = 58;
                tileW = cols * cellW; tileH = rows * cellH;
                const baseSize = 44;
                const fillOpacity = isLight ? 0.13 : 0.10;

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const glyph = glyphPool[Math.floor(rand() * glyphPool.length)];
                        const color = pickColor();
                        const cx = c * cellW + cellW / 2;
                        const cy = r * cellH + cellH / 2;
                        const op = (color === neutralColor ? fillOpacity * 0.85 : fillOpacity).toFixed(2);
                        cells.push(`<text x='${cx.toFixed(1)}' y='${cy.toFixed(1)}' font-size='${baseSize}' fill='${color}' opacity='${op}' ` +
                                   `font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>${glyph}</text>`);
                    }
                }

            } else {

                tileW = 100; tileH = 100;
            }

            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${tileW}' height='${tileH}'>` +
                        cells.join('') +
                        `</svg>`;
            return { uri: `data:image/svg+xml,${encodeSvgForUrl(svg)}`, width: tileW, height: tileH };
        }

        // Encodes an SVG string so it can be used directly as a CSS background-image URL.
        function encodeSvgForUrl(svgString) {
            return encodeURIComponent(svgString).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
        }

        // Sets up the wallpaper button: click cycles through styles, long-press (600ms) turns it off.
        // The ring animation around the button shows long-press progress.
        function initWallpaperSystem() {
            const layer = document.getElementById('wallpaperLayer');
            const btn   = document.getElementById('wallpaperStyleBtn');
            const ring  = document.getElementById('wallpaperProgressRing');
            const ringCircle = ring.querySelector('circle');
            const LONG_PRESS_MS = 600;         // how long to hold before it counts as a long press
            const RING_CIRCUMFERENCE = 138.23; // 2π × 22 (the SVG circle's radius)

            // Rebuilds and applies the current wallpaper. Called after every style change or mode switch.
            window.refreshWallpaper = function () {
                const styleObj = WALLPAPER_STYLES[wallpaperStyleIndex];
                if (styleObj.layout === 'none') {
                    layer.classList.remove('visible'); // "Off" style — just hide it
                } else {
                    const isLight = document.body.classList.contains('light-mode');
                    const tile = buildWallpaperSVG(styleObj, isLight);
                    layer.style.backgroundImage = `url('${tile.uri}')`;
                    layer.style.backgroundSize  = `${tile.width}px ${tile.height}px`;
                    layer.classList.add('visible');
                }
                // Keep the tooltip and screen-reader label up to date
                btn.title = `Background: ${WALLPAPER_STYLES[wallpaperStyleIndex].label} — click to cycle, hold to turn off`;
                btn.setAttribute('aria-label', `Background style: ${WALLPAPER_STYLES[wallpaperStyleIndex].label}. Click to cycle, hold to turn off.`);
            };

            // Long-press detection state
            let pressTimer     = null;
            let pressStartTime = null;
            let rafId          = null;
            let didLongPress   = false;

            // Called when the user presses down on the wallpaper button.
            // Starts the ring animation and sets a timer for the long-press action.
            function startPress(e) {
                if (e.button !== undefined && e.button !== 0) return; // ignore right/middle clicks
                didLongPress   = false;
                pressStartTime = Date.now();
                ring.classList.add('active');

                // Animates the SVG ring filling up as the user holds the button
                function updateRing() {
                    const elapsed  = Date.now() - pressStartTime;
                    const progress = Math.min(elapsed / LONG_PRESS_MS, 1);
                    const offset   = RING_CIRCUMFERENCE * (1 - progress);
                    ringCircle.style.strokeDashoffset = offset;
                    if (progress < 1) {
                        rafId = requestAnimationFrame(updateRing);
                    }
                }
                rafId = requestAnimationFrame(updateRing);

                // After 600ms, treat it as a long press and turn the wallpaper off
                pressTimer = setTimeout(() => {
                    didLongPress = true;
                    cancelAnimationFrame(rafId);
                    ringCircle.style.strokeDashoffset = 0;
                    wallpaperStyleIndex = 0; // index 0 is the "Off" style
                    window.refreshWallpaper();
                    btn.classList.add('long-pressing');
                    setTimeout(() => btn.classList.remove('long-pressing'), 300);
                    endPress();
                }, LONG_PRESS_MS);
            }

            // Called when the user releases or leaves the button — cleans up and resets the ring.
            function endPress() {
                clearTimeout(pressTimer);
                cancelAnimationFrame(rafId);
                pressTimer     = null;
                pressStartTime = null;
                // Animate the ring fading back to empty
                ringCircle.style.transition        = 'stroke-dashoffset 0.2s ease';
                ringCircle.style.strokeDashoffset  = RING_CIRCUMFERENCE;
                setTimeout(() => {
                    ring.classList.remove('active');
                    ringCircle.style.transition = 'stroke-dashoffset 0.05s linear';
                }, 220);
            }

            // Attach press/release events for both mouse and touch
            btn.addEventListener('mousedown',  startPress);
            btn.addEventListener('touchstart', e => { e.preventDefault(); startPress(e.touches[0]); }, { passive: false });
            btn.addEventListener('mouseup',    endPress);
            btn.addEventListener('mouseleave', endPress);
            btn.addEventListener('touchend',   endPress);
            btn.addEventListener('touchcancel',endPress);

            // A short click (not a long press) just cycles to the next wallpaper style
            btn.addEventListener('click', (e) => {
                if (didLongPress) { didLongPress = false; return; } // ignore click that ended a long press
                wallpaperStyleIndex = (wallpaperStyleIndex + 1) % WALLPAPER_STYLES.length;
                window.refreshWallpaper();
            });

            // Apply the wallpaper on first load
            window.refreshWallpaper();
        }

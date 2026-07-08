// ═══════════════════════════════════════════════════════════════════════════
// CARDS.JS — Builds and animates individual result cards: the roulette-tick spin animation,
// lock/unlock, rendering the full set of cards, rerolling a single card, and the main
// "Hit Me!" spin orchestration.
// ═══════════════════════════════════════════════════════════════════════════

        function doRouletteSpin(valueNode, pool, finalItemData, categoryKey) {
            return new Promise(resolve => {
                let ticks = 0; const maxTicks = 20 + Math.floor(Math.random() * 10); let delay = 15;
                valueNode.style.opacity = '0.5';
                function nextTick() {
                    ticks++;
                    if (ticks >= maxTicks) {
                        valueNode.textContent = categoryKey === 'components' ? (finalItemData.rule === 'use' ? 'Use ' : 'Without ') + finalItemData.name : finalItemData.name;
                        valueNode.style.opacity = '1';
                        SoundFX.land();
                        resolve(); return;
                    }
                    const randomItem = pool[Math.floor(Math.random() * pool.length)];
                    const tempRule = Math.random() < 0.5 ? 'use' : 'without';
                    valueNode.textContent = categoryKey === 'components' ? (tempRule === 'use' ? 'Use ' : 'Without ') + randomItem : randomItem;
                    SoundFX.tick();
                    delay *= 1.1; setTimeout(nextTick, delay);
                }
                nextTick();
            });
        }

        // Builds a single result card element with a lock button, item name, watermark glyph, and reroll button.
        function createCardNode(title, item, categoryKey, subIndex, isSpinning, globalIndex) {
            const card = document.createElement('div');
            card.className = 'result-card'; card.dataset.key = categoryKey; card.dataset.index = subIndex;
            if (categoryKey === 'mechanics') card.classList.add('mechanic-card');
            if (categoryKey === 'themes') card.classList.add('theme-card');
            if (categoryKey === 'components') card.classList.add('component-card');
            card.style.animationDelay = `${globalIndex * 0.1}s`;

            const isLocked = !!lockedState[categoryKey][subIndex];
            const lockBtn = document.createElement('button');
            lockBtn.className = 'lock-btn' + (isLocked ? ' locked' : '');
            lockBtn.setAttribute('aria-label', isLocked ? 'Unlock this card' : 'Lock this card');
            lockBtn.setAttribute('aria-pressed', isLocked ? 'true' : 'false');
            lockBtn.title = isLocked ? 'Locked — will be kept on next spin' : 'Click to lock';
            lockBtn.innerHTML = iconSVG('pin'); lockBtn.onclick = () => toggleLock(categoryKey, subIndex);
            card.appendChild(lockBtn);

            const info = document.createElement('div'); info.className = 'card-info';
            const titleNode = document.createElement('div'); titleNode.className = 'result-title'; titleNode.textContent = title;
            const valueNode = document.createElement('div'); valueNode.className = 'result-value';
            if (isSpinning) { valueNode.textContent = '...'; }
            else { valueNode.textContent = categoryKey === 'components' ? (item.rule === 'use' ? `Use ${item.name}` : `Without ${item.name}`) : item.name; }
            info.appendChild(titleNode); info.appendChild(valueNode); card.appendChild(info);

            const watermark = document.createElement('span');
            watermark.className = 'card-watermark'; watermark.setAttribute('aria-hidden', 'true');
            const wm = getWatermarkFor(categoryKey, subIndex, item.name);
            watermark.textContent = wm.glyph;
            watermark.style.left = `${wm.left.toFixed(1)}%`;
            watermark.style[wm.vAnchor] = `${wm.vOffset.toFixed(2)}rem`;
            watermark.style.fontSize = `${(5.5 * wm.scale).toFixed(2)}rem`;
            watermark.style.transform = `rotate(${wm.rotation}deg)`;
            card.appendChild(watermark);

            const rerollBtn = document.createElement('button');
            rerollBtn.className = 'btn-reroll'; rerollBtn.setAttribute('aria-label', 'Reroll this card');
            rerollBtn.title = 'Reroll just this card';
            rerollBtn.innerHTML = iconSVG('reroll-arrow'); if (isLocked) rerollBtn.disabled = true;
            // The spin is a CSS animation triggered by adding a class, rather than a :active-only transform —
            // that way it always plays a full smooth rotation, regardless of how briefly the button is pressed,
            // and works the same way for mouse, touch, and keyboard activation.
            rerollBtn.addEventListener('animationend', () => rerollBtn.classList.remove('spinning'));
            rerollBtn.onclick = () => {
                rerollBtn.classList.add('spinning');
                rerollSingleCard(card, categoryKey, subIndex);
            };
            card.appendChild(rerollBtn);

            return card;
        }

        // Flips the locked state for one card and updates its visual.
        function toggleLock(key, subIndex) {
            lockedState[key][subIndex] = !lockedState[key][subIndex];
            if (lockedState[key][subIndex]) SoundFX.lockOn(); else SoundFX.lockOff();
            updateCardLockUI(key, subIndex); saveState();
        }

        // Updates a card's lock button and disables/enables its reroll button to match the locked state.
        function updateCardLockUI(key, subIndex) {
            const card = document.querySelector(`.result-card[data-key="${key}"][data-index="${subIndex}"]`);
            if (!card) return;
            const isLocked = !!lockedState[key][subIndex];
            const lockBtn = card.querySelector('.lock-btn'); const rerollBtn = card.querySelector('.btn-reroll');
            lockBtn.classList.toggle('locked', isLocked);
            lockBtn.setAttribute('aria-label', isLocked ? 'Unlock this card' : 'Lock this card');
            lockBtn.setAttribute('aria-pressed', isLocked ? 'true' : 'false');
            lockBtn.title = isLocked ? 'Locked — will be kept on next spin' : 'Click to lock';
            rerollBtn.disabled = isLocked;
        }

        // Clears and redraws all result cards. If isFullSpin is true, kicks off the slot-machine animation
        // for any unlocked cards (locked cards just show their existing value immediately).
        async function renderAllCards(isFullSpin) {
            const container = document.getElementById('resultsContainer');
            let expectedCount = 0; sectionKeys.forEach(key => { if (enabledSections[key]) expectedCount += currentResults[key].length; });
            container.innerHTML = ''; if (expectedCount === 0) return;

            let globalIndex = 0;
            sectionKeys.forEach(key => {
                if (enabledSections[key]) {
                    currentResults[key].forEach((item, i) => {
                        const willSpin = isFullSpin && !lockedState[key][i];
                        const label = key.charAt(0).toUpperCase() + key.slice(1, -1); // "Theme", "Mechanic", "Component"
                        container.appendChild(createCardNode(label + ' ' + (i + 1), item, key, i, willSpin, globalIndex));
                        globalIndex++;
                    });
                }
            });

            const spinPromises = []; let index = 0;
            sectionKeys.forEach(key => {
                if (enabledSections[key]) {
                    const pool = getFilteredPool(key);
                    currentResults[key].forEach((item, i) => {
                        const card = container.children[index];
                        if (card) {
                            const valueNode = card.querySelector('.result-value');
                            if (isFullSpin && !lockedState[key][i]) { spinPromises.push(doRouletteSpin(valueNode, pool, item, key)); }
                            else { valueNode.textContent = key === 'components' ? (item.rule === 'use' ? 'Use ' : 'Without ') + item.name : item.name; }
                        }
                        index++;
                    });
                }
            });
            if (isFullSpin) {
                setAllRerollsDisabled(true);
                await Promise.all(spinPromises);
                setAllRerollsDisabled(false);
            }
        }

        // Re-rolls just one card without affecting the others. Picks a new item that isn't already shown.
        async function rerollSingleCard(cardElement, key, subIndex) {
            if (lockedState[key][subIndex]) return;
            const pool = getFilteredPool(key); if (pool.length === 0) return;
            const pickedName = getRandomItemWithoutDupes(pool, currentResults[key]);
            if (pickedName === null) return;
            const newItem = { name: pickedName };
            if (key === 'components') newItem.rule = Math.random() < 0.5 ? 'use' : 'without';
            currentResults[key][subIndex] = newItem;

            setAllRerollsDisabled(true);
            document.getElementById('spinBtn').disabled = true;
            await doRouletteSpin(cardElement.querySelector('.result-value'), pool, newItem, key);
            setAllRerollsDisabled(false);
            updateSpinAvailability();
            generatePromptSentence();
            pushHistorySnapshot();
            saveState();
        }

        // Disables or re-enables all reroll buttons during a spin (locked cards always stay disabled).
        function setAllRerollsDisabled(disabled) {
            document.querySelectorAll('.btn-reroll').forEach(btn => {

                const card = btn.closest('.result-card');
                if (card) {
                    const isLocked = !!lockedState[card.dataset.key]?.[card.dataset.index];
                    btn.disabled = disabled || isLocked;
                } else {
                    btn.disabled = disabled;
                }
            });
        }

        // Wraps a name in a highlight span so it appears in the accent colour in the prompt.
        function h(name) {
    return `<span class="highlight">${name}</span>`;
}

        // Joins a list of strings naturally: "A", "A and B", "A, B, and C".
        function joinList(items) {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

        // Main spin function — picks new random items for every unlocked slot, then animates and renders them.
        // Locked cards carry over unchanged from the previous roll.
        async function startSpin() {
            const btn = document.getElementById('spinBtn');
            btn.disabled = true;
            document.getElementById('promptBox').style.display = 'none';
            rollHeaderDice(); // fire-and-forget: purely decorative, shouldn't hold up the actual results
            clampNumberInputs(); updateSpinAvailability();
            const newResults = { mechanics: [], themes: [], components: [] };
            sectionKeys.forEach(key => {
                if (!enabledSections[key]) { lockedState[key] = []; return; }
                const count = parseInt(document.getElementById(`num${key.charAt(0).toUpperCase() + key.slice(1)}`).value, 10) || 1;
                const pool = getFilteredPool(key); const prevResults = currentResults[key] || []; const prevLocks = lockedState[key] || [];
                for (let i = 0; i < count; i++) {
                    if (i < prevResults.length && prevLocks[i]) { newResults[key].push(prevResults[i]); }
                    else {
                        const pickedName = getRandomItemWithoutDupes(pool, newResults[key]);
                        if (pickedName === null) return;
                        const newItem = { name: pickedName };
                        if (key === 'components') newItem.rule = Math.random() < 0.5 ? 'use' : 'without';
                        newResults[key].push(newItem);
                    }
                }
                lockedState[key] = newResults[key].map((_, i) => i < prevResults.length ? !!prevLocks[i] : false);
            });
            currentResults = newResults; await renderAllCards(true); generatePromptSentence(); pushHistorySnapshot(); saveState(); btn.disabled = false; updateSpinAvailability();
        }

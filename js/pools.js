// ═══════════════════════════════════════════════════════════════════════════
// POOLS.JS — Builds the checkbox pool pickers under each category, and everything to do with
// customizing them: adding/removing items, searching, resetting to defaults, and reading which
// items are currently enabled. Also owns the roll-count inputs and spin-button availability.
// ═══════════════════════════════════════════════════════════════════════════

        // Called when a category toggle switch is flipped. Updates the enabled state and dims the row visually.
        function updateRowState(key) {
            const isChecked = document.getElementById(`toggle-${key}`).checked;
            enabledSections[key] = isChecked;
            const row = document.getElementById(`row-${key}`);
            if (isChecked) row.classList.add('active'); else row.classList.remove('active');
            updateSpinAvailability();
            saveState();
        }

        // Builds the expandable pool pickers in the settings panel from masterData.
        // Each category becomes a collapsible <details> block with checkboxes for every item.
        function buildPoolPickers() {
            Object.keys(masterData).forEach(key => {
                const container = document.getElementById(`pool-${key}`);
                if (!container) return;
                let index = 0;
                Object.keys(masterData[key]).forEach(category => {
                    const details = document.createElement('details');
                    details.className = 'pool-category';
                    details.addEventListener('toggle', () => {
                        if (!details.open || container.dataset.suppressAccordion === 'true') return;
                        container.querySelectorAll('.pool-category[open]').forEach(otherDetails => {
                            if (otherDetails !== details) otherDetails.open = false;
                        });
                    });

                    const summary = document.createElement('summary');
                    const catCheck = document.createElement('input');
                    catCheck.type = 'checkbox';
                    catCheck.className = 'cat-check';
                    catCheck.checked = true;
                    catCheck.setAttribute('aria-label', `Toggle all items in ${category}`);
                    catCheck.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (catCheck.classList.contains('indeterminate')) {
                            e.preventDefault();
                            setCategoryChecked(key, category, true);
                        }
                    });
                    catCheck.addEventListener('change', () => setCategoryChecked(key, category, catCheck.checked));

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'summary-name'; nameSpan.textContent = category;
                    const countSpan = document.createElement('span');
                    countSpan.className = 'cat-count'; countSpan.textContent = masterData[key][category].length;

                    summary.appendChild(catCheck); summary.appendChild(nameSpan); summary.appendChild(countSpan);
                    details.appendChild(summary);

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'pool-content'; contentDiv.dataset.category = category;

                    masterData[key][category].forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'pool-item';
                        const inputId = `item-${key}-${index}`;

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox'; checkbox.id = inputId;
                        checkbox.dataset.cat = key; checkbox.dataset.name = item;
                        checkbox.checked = !uncheckedItems[key].has(item);
                        checkbox.addEventListener('change', () => {
                            if (checkbox.checked) uncheckedItems[key].delete(item); else uncheckedItems[key].add(item);
                            onPoolItemChange(key, category);
                            saveState();
                        });

                        const label = document.createElement('label');
                        label.setAttribute('for', inputId); label.textContent = item;
                        div.appendChild(checkbox); div.appendChild(label);

                        // Only user-added items get a remove button. Built-in items already have the
                        // checkbox for "I don't want this in the pool" — a separate delete would just
                        // be a second way to do the same thing, and a destructive one at that.
                        const isDefaultItem = (DEFAULT_MASTER_DATA[key]?.[category] || []).includes(item);
                        if (!isDefaultItem) {
                            const removeBtn = document.createElement('button');
                            removeBtn.type = 'button'; removeBtn.className = 'pool-item-remove';
                            removeBtn.setAttribute('aria-label', `Remove "${item}" from this list`);
                            removeBtn.title = 'Remove this item';
                            removeBtn.textContent = '\u00D7';
                            removeBtn.addEventListener('click', () => removePoolItem(key, category, item));
                            div.appendChild(removeBtn);
                        }

                        contentDiv.appendChild(div);
                        index++;
                    });

                    // "Add an item…" mini-form at the bottom of every category, so pools aren't limited
                    // to the built-in lists — anything typed here becomes a normal, checkable pool item.
                    const addRow = document.createElement('div');
                    addRow.className = 'pool-item-add';
                    const addInput = document.createElement('input');
                    addInput.type = 'text'; addInput.className = 'pool-add-input';
                    addInput.placeholder = 'Add an item…';
                    addInput.setAttribute('aria-label', `Add a new item to ${category}`);
                    addInput.addEventListener('input', () => addInput.setCustomValidity(''));
                    const addBtn = document.createElement('button');
                    addBtn.type = 'button'; addBtn.className = 'pool-add-btn'; addBtn.textContent = '+ Add';
                    function submitAdd() { addPoolItem(key, category, addInput.value, addInput); addInput.value = ''; }
                    addBtn.addEventListener('click', submitAdd);
                    addInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submitAdd(); } });
                    addRow.appendChild(addInput); addRow.appendChild(addBtn);
                    contentDiv.appendChild(addRow);

                    details.appendChild(contentDiv); container.appendChild(details);
                });
            });
            sectionKeys.forEach(key => { updatePoolMeta(key); Object.keys(masterData[key]).forEach(category => updateCategoryCheckState(key, category)); });
        }

        // Clears out and rebuilds every pool picker from the current masterData — used after any
        // add/remove/reset so the checkbox list always matches what's actually in masterData.
        function rebuildPoolPickers() {
            sectionKeys.forEach(key => { const c = document.getElementById(`pool-${key}`); if (c) c.innerHTML = ''; });
            buildPoolPickers();
            clampNumberInputs(); updateSpinAvailability();
        }

        // Adds a user-typed item to a category. Rejects empty input and case-insensitive duplicates
        // (shown via the input's native validation bubble, so no extra UI is needed for the warning).
        function addPoolItem(key, category, rawName, inputEl) {
            const name = rawName.trim();
            if (!name) return;
            const isDuplicate = masterData[key][category].some(n => n.toLowerCase() === name.toLowerCase());
            if (isDuplicate) {
                if (inputEl) { inputEl.setCustomValidity(`"${name}" is already in this list.`); inputEl.reportValidity(); }
                return;
            }
            masterData[key][category].push(name);
            SoundFX.addItem();
            rebuildPoolPickers();
            saveState();
        }

        // Permanently removes an item (built-in or custom) from a category.
        function removePoolItem(key, category, name) {
            const list = masterData[key][category];
            const idx = list.indexOf(name);
            if (idx === -1) return;
            list.splice(idx, 1);
            uncheckedItems[key].delete(name);
            SoundFX.removeItem();
            rebuildPoolPickers();
            saveState();
        }

        // Restores every pool to its original built-in list, discarding custom additions/removals
        // and re-checking everything. Confirmed first since it can't be undone.
        function resetPoolsToDefaults() {
            if (!confirm('Reset all pools to their original built-in lists? This removes any items you added and restores any you deleted.')) return;
            masterData = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            uncheckedItems = { mechanics: new Set(), themes: new Set(), components: new Set() };
            rebuildPoolPickers();
            saveState();
        }

        // Finds the checkbox list element for a given category inside a pool.
        function getCategoryContentEl(key, category) {
            const container = document.getElementById(`pool-${key}`);
            if (!container) return null;
            const contents = container.querySelectorAll('.pool-content');
            for (const el of contents) if (el.dataset.category === category) return el;
            return null;
        }

        // Checks or unchecks all items in a category at once (used by the category-level checkbox).
        function setCategoryChecked(key, category, checked) {
            const scope = getCategoryContentEl(key, category);
            if (!scope) return;
            scope.querySelectorAll('input[type=checkbox]').forEach(cb => { cb.checked = checked; });
            updateCategoryCheckState(key, category); updatePoolMeta(key); updateSpinAvailability();
        }

        // Updates the category-level checkbox to show checked / unchecked / indeterminate (mixed).
        function updateCategoryCheckState(key, category) {
            const scope = getCategoryContentEl(key, category);
            if (!scope) return;
            const boxes = Array.from(scope.querySelectorAll('input[type=checkbox]'));
            const checkedCount = boxes.filter(cb => cb.checked).length;
            const catCheck = scope.closest('.pool-category').querySelector('.cat-check');
            if (checkedCount === 0) { catCheck.checked = false; catCheck.classList.remove('indeterminate'); catCheck.indeterminate = false; }
            else if (checkedCount === boxes.length) { catCheck.checked = true; catCheck.classList.remove('indeterminate'); catCheck.indeterminate = false; }
            else { catCheck.checked = false; catCheck.classList.add('indeterminate'); catCheck.indeterminate = true; }
        }

        // Called whenever a single pool item checkbox changes — updates the category header and spin button.
        function onPoolItemChange(key, category) {
            if (category) updateCategoryCheckState(key, category);
            updatePoolMeta(key); updateSpinAvailability();
        }

        // Shows "X of Y selected" below each pool, or a warning if nothing is selected.
        function updatePoolMeta(key) {
            const meta = document.getElementById(`pool-meta-${key}`);
            if (!meta) return;
            const total = document.querySelectorAll(`#pool-${key} input[type=checkbox]:not(.cat-check)`).length;
            const checked = document.querySelectorAll(`#pool-${key} input[type=checkbox]:not(.cat-check):checked`).length;
            if (checked === 0) { meta.textContent = `0 of ${total} selected — turn at least one on to draw from this pool`; meta.classList.add('warn'); }
            else { meta.textContent = `${checked} of ${total} selected`; meta.classList.remove('warn'); }
        }

        // Filters the visible pool items as the user types in the search box.
        // Hides non-matching items and auto-expands categories that have matches.
        function filterPool(inputElement) {
            const query = inputElement.value.toLowerCase();
            const poolWrapper = inputElement.parentElement;
            const categories = poolWrapper.querySelectorAll('.pool-category');
            const poolContainer = poolWrapper.querySelector('[id^="pool-"]');
            if (poolContainer) poolContainer.dataset.suppressAccordion = 'true';

            categories.forEach(cat => {
                let hasVisibleItem = false;
                const items = cat.querySelectorAll('.pool-item');
                items.forEach(item => {
                    if (item.textContent.toLowerCase().includes(query)) { item.style.display = 'flex'; hasVisibleItem = true; }
                    else { item.style.display = 'none'; }
                });
                if (query !== "") { cat.style.display = hasVisibleItem ? 'block' : 'none'; if (hasVisibleItem) cat.open = true; }
                else { cat.style.display = 'block'; cat.open = false; }
            });
            if (poolContainer) poolContainer.dataset.suppressAccordion = 'false';
        }

        // Handles "Show pool / Hide pool" toggle buttons — closes any other open pool first.
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('pool-toggle')) {
                const targetId = e.target.getAttribute('data-target');
                const wrapper = document.getElementById(targetId);
                const willOpen = !wrapper.classList.contains('open');
                document.querySelectorAll('.pool-wrapper.open').forEach(otherWrapper => {
                    if (otherWrapper !== wrapper) {
                        otherWrapper.classList.remove('open');
                        const otherToggle = document.querySelector(`.pool-toggle[data-target="${otherWrapper.id}"]`);
                        if (otherToggle) otherToggle.innerText = '[+] Show pool';
                    }
                });
                wrapper.classList.toggle('open', willOpen);
                e.target.innerText = willOpen ? `[-] Hide pool` : `[+] Show pool`;
            }
        });

        // Returns only the currently checked items from a pool as a flat array of name strings.
        function getFilteredPool(key) { return Array.from(document.querySelectorAll(`#pool-${key} input[type=checkbox]:not(.cat-check):checked`)).map(cb => cb.getAttribute('data-name')); }

        // Picks a random item from the pool, excluding anything already in the current roll (no duplicates).
        function getRandomItemWithoutDupes(pool, currentSelections) {
            const trackingNames = currentSelections.map(s => s.name);
            const filteredPool = pool.filter(name => !trackingNames.includes(name));
            if (filteredPool.length === 0) return null;
            return filteredPool[Math.floor(Math.random() * filteredPool.length)];
        }

        // Makes sure the number inputs (how many to roll) don't exceed the available pool size.
        // e.g. if only 3 mechanics are checked, you can't roll 5.
        function clampNumberInputs() {
            sectionKeys.forEach(key => {
                const input = document.getElementById(`num${key.charAt(0).toUpperCase() + key.slice(1)}`);
                const max = parseInt(input.getAttribute('max'), 10);
                const min = parseInt(input.getAttribute('min'), 10);
                const poolSize = Math.max(getFilteredPool(key).length, 0);
                const effectiveMax = poolSize > 0 ? Math.min(max, poolSize) : max;
                let val = parseInt(input.value, 10);
                if (isNaN(val)) val = min;
                input.value = Math.min(Math.max(val, min), effectiveMax || min);
            });
        }

        // Enables or disables the spin button and shows an error message if the setup isn't valid
        // (e.g. no categories on, or a category is on but has no items selected).
        function updateSpinAvailability() {
            const errorEl = document.getElementById('spinError');
            const spinBtn = document.getElementById('spinBtn');
            const anyEnabled = sectionKeys.some(k => enabledSections[k]);

            if (!anyEnabled) { errorEl.textContent = 'Turn on at least one category to spin.'; spinBtn.disabled = true; return; }
            const emptyPools = sectionKeys.filter(k => enabledSections[k] && getFilteredPool(k).length === 0);
            if (emptyPools.length > 0) { errorEl.textContent = `Select at least one item in: ${emptyPools.join(', ')}.`; spinBtn.disabled = true; return; }
            errorEl.textContent = ''; spinBtn.disabled = false;
        }

        // SCAMPER: design thinking prompts tied to specific keywords in the Word Inspiration pool.
        // Each entry is a function that takes up to two mechanic names and returns an HTML question string.
        // If a rolled theme matches one of these keys, the question gets appended to the generated prompt.
        const SCAMPER = {
    "Substitute": (m1, m2) => m1 === m2 
        ? `How could you <span class="highlight">substitute</span> something from the ${m1} mechanic?` 
        : `How could you <span class="highlight">substitute</span> something from the ${m1} or ${m2} mechanics?`,
    "Combine": (m1, m2) => `How could you <span class="highlight">combine</span> the ${m1} mechanic with something else?`,
    "Adapt": (m1, m2) => `What part could you <span class="highlight">adapt</span> from ${m1} in a different way?`,
    "Modify": (m1, m2) => `How could you <span class="highlight">modify</span>, magnify, or minify ${m1}?`,
    "Put to another use": (m1, m2) => `How could you <span class="highlight">put</span> the components or rules of ${m1} <span class="highlight">to another use</span>?`,
    "Eliminate": (m1, m2) => `What happens if you <span class="highlight">eliminate</span> a standard rule or requirement from ${m1}?`,
    "Reverse": (m1, m2) => `How could you <span class="highlight">reverse</span> the ${m1} mechanic?`
};
        // VIBES_SET: themes that describe a tone or feeling rather than a subject.
        // These get phrased as "with a Cozy tone" instead of "about Cozy" in the prompt.
        const VIBES_SET = new Set([
            'Cozy','Competitive','Simple','Chaotic','Relaxing','Fast-Paced',
            'Tense','Whimsical','Grim','Strategic','Abstract','Nostalgic',
            'Surreal','Tactical',
        ]);

        // INSPIRATION_SET: unusual/evocative words that spark creative thinking.
        // These get phrased as "Use the word X to inspire you" in the prompt.
        const INSPIRATION_SET = new Set([
            'Crux','Redolent','Interloper','Deleterious','Foible','Saturnine',
            'Blandishment','Ephemeral','Labyrinthine','Quixotic','Halcyon',
            'Ineffable','Mellifluous','Sonder',
        ]);
        // masterData: the full pool of options for each category.
        // Organised into named groups (e.g. "Cards & Drafting") purely for display in the pool picker.
        // To add new items, just add them to the relevant array. To add a new group, add a new key.
        const masterData = {
            mechanics: {
                "Actions & Phase Management": ["Acting", "Action / Event", "Action Drafting", "Action Points", "Action Queue", "Action Retrieval", "Action Timer", "Elapsed Real Time Ending", "Events", "Expiring Actions", "Simultaneous Action Selection", "Variable Phase Order", "Programmed Movement"],
                "Auctions & Bidding": ["Auction / Bidding", "Auction Compensation", "Auction: Dexterity", "Auction: Dutch", "Auction: Dutch Priority", "Auction: English", "Auction: Fixed Placement", "Auction: Multiple Lot", "Auction: Once Around", "Auction: Sealed Bid", "Auction: Turn Order Until Pass", "Bids As Wagers", "Constrained Bidding", "Predictive Bid", "Selection Order Bid", "Turn Order: Auction"],
                "Cards & Drafting": ["Bag Building", "Card Play Conflict Resolution", "Closed Drafting", "Command Cards", "Deck Construction", "Deck Building", "Drawing Card/Tile", "Hand Management", "Layering Card/Tile", "Move Through Deck", "Multi-Use Cards", "Open Drafting", "Pool Building", "Trick-Taking", "Melding and Splaying"],
                "Movement & Spatial Layout": ["Area Movement", "Area-Impulse", "Connections", "Crayon Rail System", "Different Dice Movement", "Facing", "Grid Movement", "Hexagon Grid", "Hidden Movement", "Impulse Movement", "Measurement Movement", "Movement Points", "Movement Template", "Moving Multiple Units", "Multiple Maps", "Network and Route Building", "Pattern Movement", "Pick-up and Deliver", "Point to Point Movement", "Relative Movement", "Resource to Move", "Track Movement", "Three Dimensional Movement", "Zone of Control", "Slide / Push", "Map Addition", "Map Deformation", "Map Reduction", "Modular Board", "Pieces as Map"],
                "Dice & Probability": ["Cube Tower", "Dice Rolling", "Dice Building", "Die Icon Resolution", "Push Your Luck", "Random Production", "Re-rolling and Locking", "Roll / Spin and Move", "Roll and Write", "Worker Placement with Dice Workers"],
                "Social & Negotiation": ["Asymmetric Information / Limited Communication", "Betting and Bluffing", "Bribery", "Communication Limits", "Hidden Roles", "Negotiation", "Player Judge", "Prisoner's Dilemma", "Questions and Answers", "Rock-Paper-Scissors", "Storytelling", "Take That", "Targeted Clues", "Trading", "Traitor", "Voting", "Alliances", "Cooperative", "Semi-Cooperative Game", "Team-Based Game"],
                "Economy & Engine Building": ["Automatic Resource Growth", "Chaining", "Closed Economy", "Commodity Speculation", "Contracts", "Delayed Purchase", "Engine Building", "Income", "Increase Value of Unchosen Resources", "Investment", "Market", "Ownership", "Resource Queue", "Shared Incentive / Market Decay", "Stock Holding", "Tableau Building", "Tech Trees / Tracks", "Victory Points as a Resource", "Loans"],
                "Tile Placement & Patterns": ["Enclosure", "Grid Coverage", "Matching", "Pattern Building", "Pattern Recognition", "Polyomino Tile Placement", "Square Grid", "Stacking and Balancing", "Tag Matching", "Tile Placement"],
                "Turn Order & Worker Placement": ["Passed Action Token", "Turn Order: Claim Action", "Turn Order: Pass Order", "Turn Order: Progressive", "Turn Order: Random", "Turn Order: Role Order", "Turn Order: Stat-Based", "Turn Order: Time Track", "Worker Placement", "Worker Placement, Different Worker Types"],
                "Combat & Resolution": ["Algorithmic Resolution", "Bias", "Bingo", "Critical Hits and Failures", "Flicking", "Follow the Leader", "Force Commitment", "Interrupts", "Kill Steal", "King of the Hill", "Ladder Climbing", "Lane Battler", "Line Drawing", "Line of Sight", "Memory", "Minimap Resolution", "Neighbor Scope", "Physical Removal", "Ratio / Combat Results Table", "Stat Check Resolution", "Static Capture", "Tug of War"],
                "Progression & Win Conditions": ["Advantage Token", "Area Majority / Influence", "Asymmetric Roles", "Catch the Leader", "Chit-Pull System", "Deduction", "End Game Bonuses", "Finale Ending", "Handicaps", "Hidden Victory Points", "Highest-Lowest Scoring", "Hot Potato", "I Cut, You Choose", "Induction", "Legacy", "Lose a Turn", "Mancala", "Narrative Choice / Paragraph", "Once-Per-Game Abilities", "Order Counters", "Ordering", "Paper-and-Pencil", "Player Elimination", "Race", "Real-Time", "Retirement", "Rondel", "Scenario / Mission / Campaign Game", "Score-and-Reset Game", "Secret Deployment", "Set Collection", "Simulation", "Single Loser Game", "Single Play", "Solo", "Speed Matching", "Spelling", "Sudden Death Ending", "Variable Player Powers", "Variable Set-up", "Visual Restriction"]
            },
            themes: {
                "Sci-Fi": ["Robots", "Mechs", "Cyberpunk", "Steampunk", "Scavengers", "Survivors", "Time Travel", "Clones", "Aliens", "Space Stations", "Alien Worlds", "Moon Bases", "Floating Cities", "Near Future", "Far Future", "Post Apocalypse", "Dystopian", "Solarpunk", "First Contact", "Generation Ships", "Black Holes", "Asteroids", "Nebulas", "Wormholes", "Comets"],
                "Fantasy & Myth": ["Knights", "Dragons", "Wizards", "Bards", "Alchemists", "Dwarves", "Elves", "Witches", "Necromancers", "Orcs", "Goblins", "Fairies", "Giants", "Merfolk", "Kaiju", "Golems", "Demons", "Angels", "Shapeshifters", "Trolls", "Centaurs", "Mummies", "Skeletons", "Banshees", "Sirens", "Krakens", "Phoenixes", "Griffins", "Unicorns", "Norse Mythology", "Greek Mythology", "Egyptian Mythology", "Shinto Spirits", "Folklore"],
                "Horror": ["Vampires", "Werewolves", "Zombies", "Sea Monsters", "Haunted Houses", "Catacombs", "Plague", "Mediums", "Oracles", "Cultists", "Eldritch", "Ghosts"],
                "Historical": ["Stone Age", "Ancient Egypt", "Ancient Greece", "Roman Empire", "Medieval Era", "Renaissance", "Gladiators", "Samurai", "Vikings", "Pirates", "Age of Exploration", "Wild West", "Cowboys", "Victorian Era", "Industrial Revolution", "Roaring Twenties", "Modern Day", "Alternate History", "Bronze Age", "Iron Age", "Edo Period", "Gilded Age", "Cold War Era", "Space Race"],
                "Occupations": ["Chefs", "Librarians", "Explorers", "Divers", "Miners", "Farmers", "Doctors", "Scientists", "Archaeologists", "Inventors", "Engineers", "Artists", "Musicians", "Spies", "Bounty Hunters", "Merchants", "Blacksmiths", "Rangers", "Astronauts", "Colonists", "Teachers", "Falconers", "Beekeepers", "Lumberjacks", "Cartographers", "Diplomats", "Tailors", "Brewers", "Postal Workers", "Tinkerers", "Monks", "Nuns", "Hermits", "Rock Bands", "Orchestras", "Theater Troupes", "Opera Singers", "DJs", "Dancers", "Buskers", "Programmers", "Baristas", "Lawyers", "Realtors", "Construction Workers", "Food Truck Owners"],
                "Environments & Cities": ["Castles", "Dungeons", "Ancient Ruins", "Lost Cities", "Floating Islands", "Deep Sea", "Jungles", "Deserts", "Frozen Lands", "Volcanoes", "Crystal Caves", "Underground Kingdoms", "Factories", "Libraries", "Museums", "Carnivals", "Theme Parks", "Schools", "Hospitals", "Prisons", "Lighthouses", "Windmills", "Greenhouses", "Marketplaces", "Shipwrecks", "Caravans", "Border Towns", "Mountain Peaks", "Coral Reefs", "Swamps", "Glaciers"],
                "Crime & Intrigue": ["Gangsters", "Criminals", "Bandits", "Smugglers", "Mercenaries", "Detectives", "Assassins", "Royalty", "Elections", "Court Intrigue", "Revolution", "Senates", "Rebellions", "Heists", "Cons", "Smuggling Rings", "Mob Bosses", "Prison Breaks", "Jewel Thieves"],
                "Festive & Everyday": ["Christmas", "Halloween", "Valentine's Day", "Easter", "Thanksgiving", "New Year's Eve", "Lunar New Year", "Carnival", "Harvest Festival", "Winter Festival", "Summer Festival", "Birthdays", "Weddings", "Funerals", "Tournaments", "Masquerade Balls", "Bakeries", "Breweries", "Restaurants", "Farmers Markets", "Street Food", "Wineries", "Tea Houses", "Natural Disasters", "Shipwreck Survivors", "Famine", "Drought", "Quarantine"],
                "Objects": ["Books", "Maps", "Keys", "Masks", "Mirrors", "Crowns", "Swords", "Shields", "Coins", "Gears", "Clocks", "Candles", "Lanterns", "Potions", "Artifacts", "Treasures", "Toys", "Dolls", "Paintings", "Statues", "Marionettes", "Puppets", "Clockwork", "Stained Glass", "Mosaics", "Pottery", "Vintage Posters", "Blueprints", "Scrapbooks", "Quilts", "Ancient Scrolls", "Tarot Cards", "Music Boxes"],
                "Animals": ["Dinosaurs", "Insects", "Dogs", "Cats", "Birds", "Horses", "Bears", "Wolves", "Sharks", "Whales", "Bees", "Ants", "Owls", "Foxes"],
                "Vehicles": ["Trains", "Airships", "Submarines", "Spaceships", "Cars", "Planes", "Trucks", "Motorcycles", "Race Cars", "Monster Trucks", "Helicopters", "Hot Air Balloons", "Tanks", "Bicycles", "Sleds", "Gliders", "Buses", "Rickshaws", "Hovercrafts", "Demolition Derbies"],
                "Sports": ["Soccer", "Basketball", "Baseball", "Boxing", "The Olympics", "Football", "Hockey", "Golf", "Tennis", "Racing"],
                "Vibes": ["Cozy", "Competitive", "Simple", "Chaotic", "Relaxing", "Fast-Paced", "Tense", "Whimsical", "Grim", "Strategic", "Abstract", "Nostalgic", "Surreal", "Tactical"],
                "Word Inspiration": ["Crux", "Redolent", "Interloper", "Deleterious", "Foible", "Saturnine", "Blandishment", "Ephemeral", "Labyrinthine", "Quixotic", "Halcyon", "Ineffable", "Mellifluous", "Sonder", "Substitute", "Combine", "Adapt", "Modify", "put to another use", "Eliminate", "Reverse"]
            },
            components: {
                "Cards & Dice": ["18 Cards", "10 Cards", "5 Cards", "a Deck of Cards", "a Single Card", "Two Decks of Cards", "Playing Cards", "Tarot Cards", "1 Die", "2 Dice", "5 Dice", "10 Dice", "Polyhedral Dice", "Custom Dice"],
                "Tokens & Tracking": ["a Bag of Tokens", "10 Tokens", "1 Token", "Coins", "Gemstones", "Crystals", "Beads", "Marbles", "Stones", "a Timer", "a Sand Timer", "a Spinning Wheel", "a Clock", "a Dial", "a Track", "Acrylic Gems", "Wooden Discs", "Wooden Cubes", "Resin Tokens", "a Scorepad", "a Sandglass Tower", "a Rotating Dial"],
                "Stationery & Media": ["Paper", "a Pencil", "a Pen", "a Marker", "a Paint Brush", "a Stamp", "Stickers", "a Letter", "a Photograph", "a Newspaper", "a Blueprint", "Erasable Markers", "a Dry-Erase Board", "Ancient Scrolls", "Riddles", "Carved Runes"],
                "Containers & Structural": ["Cups", "a Game Board", "a Shared Board", "Individual Boards", "a Hidden Envelope", "a Secret Note", "a Locked Box", "a Container", "a Screen", "a Blindfold", "a Pouch", "Wax Seals", "Stacking Pieces", "Folding Pieces", "Sliding Pieces", "Rotating Pieces", "Puzzle Pieces", "Building Pieces", "Miniatures", "Figures", "Meeples", "Wooden Pieces", "Plastic Pieces", "Metal Pieces", "Glass Pieces", "Transparent Pieces", "Transparent Overlays", "Tiles", "Hex Tiles", "Dominoes", "Interlocking Pieces", "a Pop-Up Tent Piece"],
                "Utilities & Toys": ["String", "Rope", "Magnets", "Keys", "Locks", "Chains", "Rings", "Yarn", "a Bell", "a Whistle", "Feathers", "Shells", "a Magnifying Glass", "a Compass", "a Folding Map", "a Spyglass", "a Velcro Strip", "a Cloth Map", "Mini Easels", "a Kazoo", "a Buzzer", "a Hand Drum", "a Hat", "a Cape", "a Sash", "Wristbands", "a Mask", "a Flashlight", "Glow Sticks", "Glow-in-the-Dark Pieces", "a Toy Phone", "a Walkie-Talkie", "a Toy Remote Control", "a Launcher", "a Catapult", "a Cannon"],
            }
        };

        // State: tracks which categories are switched on, what was last rolled, and which cards are locked.
        let enabledSections = { themes: true, mechanics: true, components: true };
        let currentResults = { mechanics: [], themes: [], components: [] };
        let lockedState = { mechanics: [], themes: [], components: [] };
        const sectionKeys = ['themes', 'mechanics', 'components']; // order controls display order

        // GLYPHS: unicode symbol sets used for the decorative background wallpaper patterns.
        const GLYPHS = {
            suits_outline: ['\u2661', '\u2662', '\u2664', '\u2667'],
            suits_solid: ['\u2660', '\u2663', '\u2665', '\u2666'],
            chess: ['\u2654', '\u2655', '\u2656', '\u2657', '\u2658', '\u2659', '\u265A', '\u265B', '\u265C', '\u265D', '\u265E', '\u265F'],
            draughts: ['⛀', '⛁', '⛂', '⛃'],
            dice: ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'],
            dominoes: [
            '🁭', '🁵', '🁢', '🁣', '🁤', '🁥', '🁦', '🁧', '🁨', '🁩', '🁪', '🁫', '🁬', '🁭', '🁮', '🁯', '🁰', '🁱', '🁲', '🁳',
            '🁴', '🁵', '🁶', '🁷', '🁸', '🁹', '🁺', '🁻', '🁼', '🁽', '🁾', '🁿', '🂀', '🂁', '🂂', '🂃', '🂄', '🂅', '🂆', '🂇',
            '🂈', '🂉', '🂊', '🂋', '🂌', '🂍', '🂎', '🂏', '🂐', '🂑', '🂒', '🂓'], 
            shapes: ['◈', '◆', '◇', '◉', '✦', '✧', '⟡', '⟢', '⟣', '⟤'],
            blocks: ['░', '▒', '▓', '█', '▌', '▐', '▀', '▄'],
            cards: [
                '🂡', '🂱', '🃁', '🃑', '🂢', '🂲', '🃂', '🃒', '🂣', '🂳', '🃃', '🃓',
                '🂤', '🂴', '🃄', '🃔', '🂥', '🂵', '🃅', '🃕', '🂦', '🂶', '🃆', '🃖',
                '🂧', '🂷', '🃇', '🃗', '🂨', '🂸', '🃈', '🃘', '🂩', '🂹', '🃉', '🃙',
                '🂪', '🂺', '🃊', '🃚', '🂫', '🂻', '🃋', '🃛', '🂬', '🂼', '🃌', '🃜',
                '🂭', '🂽', '🃍', '🃝', '🂮', '🂾', '🃎', '🃞', '🂠', '🂿', '🃟'
            ],
            mahjong: ['🀀', '🀁', '🀃', '🀅']
        };

        // All glyph sets merged into one flat list for picking random card watermarks.
        const WATERMARK_GLYPHS = [
            ...GLYPHS.suits_outline, ...GLYPHS.suits_solid, ...GLYPHS.chess, ...GLYPHS.draughts,
            ...GLYPHS.dice, ...GLYPHS.dominoes, ...GLYPHS.shapes, ...GLYPHS.blocks, ...GLYPHS.cards, ...GLYPHS.mahjong
        ];

        // Some glyphs are naturally wider/taller, so we scale them up so they all look similar in size on cards.
        const WATERMARK_SCALE = {};
        GLYPHS.suits_outline.forEach(g => WATERMARK_SCALE[g] = 1.5);
        GLYPHS.suits_solid.forEach(g => WATERMARK_SCALE[g] = 1.4);
        GLYPHS.chess.forEach(g => WATERMARK_SCALE[g] = 1.5);
        GLYPHS.dice.forEach(g => WATERMARK_SCALE[g] = 1.1);
        GLYPHS.shapes.forEach(g => WATERMARK_SCALE[g] = 1.2);
        GLYPHS.blocks.forEach(g => WATERMARK_SCALE[g] = 1);
        GLYPHS.cards.forEach(g => WATERMARK_SCALE[g] = 1.1);

        // Turns a string into a stable number — used to give each card a consistent random watermark
        // based on its content, so the same item always gets the same glyph/position.
        function hashString(str) {
            let h = 0;
            for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
            return Math.abs(h);
        }

        // Generates a list of pseudo-random numbers from a seed. Same seed always gives same numbers,
        // so watermark properties (glyph, position, rotation) are stable per card item.
        function seededValues(seed, count) {
            let s = seed % 2147483647;
            if (s <= 0) s += 2147483646;
            const out = [];
            for (let i = 0; i < count; i++) {
                s = (s * 16807) % 2147483647;
                out.push((s - 1) / 2147483646);
            }
            return out;
        }

        // Picks a watermark glyph, size, rotation, and position for a result card.
        // Uses the item name + card position as a seed so the same item always looks the same.
       function getWatermarkFor(categoryKey, subIndex, itemName) {
    const seed = hashString(`${categoryKey}:${subIndex}:${itemName}`);
    const [rGlyph, rLeft, rTop, rSize, rRotation, rVAnchor] = seededValues(seed, 6);
    const glyph = WATERMARK_GLYPHS[Math.floor(rGlyph * WATERMARK_GLYPHS.length)];
    const baseScale = WATERMARK_SCALE[glyph] || 1.0;
    const sizeMultiplier = 1.1; 
    const scale = baseScale * sizeMultiplier;
    const left = 12 + rLeft * 76;
    const rotation = Math.round((rRotation - 0.5) * 50);
    // vAnchor and vOffset keep the watermark peeking within the card edges
    const vAnchor = rVAnchor < 0.5 ? 'top' : 'bottom';
    const vOffset = -0.5 + rTop * 0.8; // small positive/negative so glyph clips nicely at edge
    
    return { glyph, scale, rotation, left, vAnchor, vOffset };
}

        // Called when a category toggle switch is flipped. Updates the enabled state and dims the row visually.
        function updateRowState(key) {
            const isChecked = document.getElementById(`toggle-${key}`).checked;
            enabledSections[key] = isChecked;
            const row = document.getElementById(`row-${key}`);
            if (isChecked) row.classList.add('active'); else row.classList.remove('active');
            updateSpinAvailability();
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
                        div.innerHTML = `<input type="checkbox" id="${inputId}" data-cat="${key}" data-name="${item}" checked onchange="onPoolItemChange('${key}', '${category.replace(/'/g, "\\'")}')"><label for="${inputId}">${item}</label>`;
                        contentDiv.appendChild(div);
                        index++;
                    });
                    details.appendChild(contentDiv); container.appendChild(details);
                });
            });
            sectionKeys.forEach(key => { updatePoolMeta(key); Object.keys(masterData[key]).forEach(category => updateCategoryCheckState(key, category)); });
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

        // Animates a card's text rapidly cycling through random values before landing on the final result.
        // Slows down gradually like a slot machine. Returns a Promise that resolves when done.
        function doRouletteSpin(valueNode, pool, finalItemData, categoryKey) {
            return new Promise(resolve => {
                let ticks = 0; const maxTicks = 20 + Math.floor(Math.random() * 10); let delay = 15;
                valueNode.style.opacity = '0.5';
                function nextTick() {
                    ticks++;
                    if (ticks >= maxTicks) {
                        valueNode.textContent = categoryKey === 'components' ? (finalItemData.rule === 'use' ? 'Use ' : 'Without ') + finalItemData.name : finalItemData.name;
                        valueNode.style.opacity = '1';
                        resolve(); return;
                    }
                    const randomItem = pool[Math.floor(Math.random() * pool.length)];
                    const tempRule = Math.random() < 0.5 ? 'use' : 'without';
                    valueNode.textContent = categoryKey === 'components' ? (tempRule === 'use' ? 'Use ' : 'Without ') + randomItem : randomItem;
                    delay *= 1.1; setTimeout(nextTick, delay);
                }
                nextTick();
            });
        }

        // Builds the markup for an inline icon that references a <symbol> from the SVG sprite in index.html.
        // Using <use> (rather than <img>) means the icon's fill inherits `currentColor`, so it automatically
        // matches whatever color the surrounding button/text is styled with — including theme and hover changes.
        function iconSVG(id) {
            return `<svg class="icon" aria-hidden="true"><use href="#icon-${id}"></use></svg>`;
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
        function toggleLock(key, subIndex) { lockedState[key][subIndex] = !lockedState[key][subIndex]; updateCardLockUI(key, subIndex); }

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

        // Builds and displays the final prompt sentence from whatever is currently rolled.
        // Sorts themes into three buckets (standard / vibes / inspirations) and handles SCAMPER keywords.
        // Called after every spin or reroll.
        function generatePromptSentence() {
    const promptBox   = document.getElementById('promptBox');
    const finalPrompt = document.getElementById('finalPrompt');
    if (!sectionKeys.some(k => enabledSections[k] && currentResults[k].length > 0)) {
        promptBox.style.display = 'none';
        return;
    }

    
    const mechanicNames = (enabledSections.mechanics && currentResults.mechanics.length > 0)
        ? currentResults.mechanics.map(m => m.name)
        : [];

    // Classify themes
    const standardThemes = [];
    const vibes          = [];
    const inspirations   = [];
    let   scamperKey     = null;

    if (enabledSections.themes && currentResults.themes.length > 0) {
        currentResults.themes.forEach(({ name }) => {
            const matchedScamper = Object.keys(SCAMPER).find(
                k => k.toLowerCase() === name.toLowerCase()
            );
            if (matchedScamper)         scamperKey = matchedScamper;
            else if (VIBES_SET.has(name))        vibes.push(name);
            else if (INSPIRATION_SET.has(name))  inspirations.push(name);
            else                                 standardThemes.push(name);
        });
    }

    // Build components
    const useItems     = [];
    const withoutItems = [];
    if (enabledSections.components && currentResults.components.length > 0) {
        currentResults.components.forEach(c => {
            if (c.rule === 'use') useItems.push(c.name);
            else                  withoutItems.push(c.name);
        });
    }

    // Assemble sentence parts
    const parts = [];

    const themeLabels = [
        ...standardThemes.map(h),
        ...vibes.map(v => `a ${h(v)} tone`),
    ];
    if (themeLabels.length > 0) {
        parts.push(`about ${joinList(themeLabels)}`);
    }

    if (mechanicNames.length > 0) {
        const word = mechanicNames.length === 1 ? 'mechanic' : 'mechanics';
        parts.push(`featuring ${joinList(mechanicNames.map(h))} ${word}`);
    }

    const compParts = [];
    if (useItems.length > 0)     compParts.push(`using ${joinList(useItems.map(h))}`);
    if (withoutItems.length > 0) compParts.push(`without ${joinList(withoutItems.map(h))}`);
    if (compParts.length > 0)    parts.push(compParts.join(', '));

    if (parts.length === 0) { promptBox.style.display = 'none'; return; }

    // Join parts with "while" before the component clause (matching original grammar)
    let out;
    if (parts.length === 1) {
        out = `Design a game ${parts[0]}.`;
    } else if (parts.length === 2) {
        out = `Design a game ${parts[0]} ${parts[1]}.`;
    } else {
        out = `Design a game ${parts.slice(0, -1).join(', ')}, while ${parts[parts.length - 1]}.`;
    }

    // Word inspirations as a separate sentence
    if (inspirations.length > 0) {
        out += ` Use ${joinList(inspirations.map(w => `the word ${h(w)}`))} to inspire you.`;
    }

    // SCAMPER question appended last
    if (scamperKey) {
        const m1 = mechanicNames[0] || '';
        const m2 = mechanicNames[1] || m1;
        out += m1
            ? ` ${SCAMPER[scamperKey](m1, m2)}`
            : ` Apply ${h(scamperKey)} to your game design.`;
    }

    finalPrompt.innerHTML = out.charAt(0).toUpperCase() + out.slice(1);
    promptBox.style.display = 'block';

    const copyBtn = document.getElementById('copyBtn');
    copyBtn.classList.remove('copied');
    copyBtn.textContent = 'Copy prompt';
}

        // Copies the plain-text version of the prompt to the clipboard and briefly shows "Copied!".
        function copyPrompt() {
            const text = document.getElementById('finalPrompt').textContent;
            const copyBtn = document.getElementById('copyBtn');
            function showCopied() { copyBtn.textContent = 'Copied!'; copyBtn.classList.add('copied'); setTimeout(() => { copyBtn.textContent = 'Copy prompt'; copyBtn.classList.remove('copied'); }, 1600); }
            if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(showCopied).catch(() => fallbackCopy(text, showCopied)); } 
            else { fallbackCopy(text, showCopied); }
        }

        // Older clipboard fallback for browsers that don't support navigator.clipboard.
        function fallbackCopy(text, onSuccess) {
            const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); onSuccess(); } catch (e) {} document.body.removeChild(ta);
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
            currentResults = newResults; await renderAllCards(true); generatePromptSentence(); btn.disabled = false; updateSpinAvailability();
        }

        // Re-validates the spin button whenever a count input changes.
        sectionKeys.forEach(key => { document.getElementById(`num${key.charAt(0).toUpperCase() + key.slice(1)}`).addEventListener('change', () => { clampNumberInputs(); updateSpinAvailability(); }); });

        // Kicks everything off once the page has fully loaded.
        document.addEventListener('DOMContentLoaded', () => { buildPoolPickers(); updateSpinAvailability(); initWallpaperSystem(); initThemeToggle(); updateSpinAvailability(); });

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

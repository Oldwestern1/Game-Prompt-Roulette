// ═══════════════════════════════════════════════════════════════════════════
// DATA.JS — Static content pools, shared app state, and small hash/seed utilities.
// Everything here is just data or pure helper functions — no DOM access, no event wiring.
// Loaded first since every other file reads from the state declared here.
// ═══════════════════════════════════════════════════════════════════════════

        // SCAMPER: design thinking prompts tied to specific keywords in the Word Inspiration pool.
        // Each entry is a function that takes up to two mechanic names and returns an HTML question string.
        // If a rolled theme matches one of these keys, the question gets appended to the generated prompt.
        const SCAMPER = {
    "Substitute": (m1, m2) => m1 === m2
        ? `How could you <span class="highlight">substitute</span> something from the ${escapeHTML(m1)} mechanic?`
        : `How could you <span class="highlight">substitute</span> something from the ${escapeHTML(m1)} or ${escapeHTML(m2)} mechanics?`,
    "Combine": (m1, m2) => `How could you <span class="highlight">combine</span> the ${escapeHTML(m1)} mechanic with something else?`,
    "Adapt": (m1, m2) => `What part could you <span class="highlight">adapt</span> from ${escapeHTML(m1)} in a different way?`,
    "Modify": (m1, m2) => `How could you <span class="highlight">modify</span>, magnify, or minify ${escapeHTML(m1)}?`,
    "Put to another use": (m1, m2) => `How could you <span class="highlight">put</span> the components or rules of ${escapeHTML(m1)} <span class="highlight">to another use</span>?`,
    "Eliminate": (m1, m2) => `What happens if you <span class="highlight">eliminate</span> a standard rule or requirement from ${escapeHTML(m1)}?`,
    "Reverse": (m1, m2) => `How could you <span class="highlight">reverse</span> the ${escapeHTML(m1)} mechanic?`
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
        let masterData = {
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

        // A frozen-in-spirit copy of the original built-in pools, taken before any user edits happen.
        // "Reset pools to defaults" restores masterData from this rather than re-declaring it by hand.
        const DEFAULT_MASTER_DATA = JSON.parse(JSON.stringify(masterData));

        // Tracks which item names the user has unchecked, per category-group. Kept separately from
        // masterData (which only holds *what items exist*) so a pool rebuild can restore checked state.
        let uncheckedItems = { mechanics: new Set(), themes: new Set(), components: new Set() };

        // Prompt history: a simple undo/redo-style stack of past rolls & rerolls, so the prompt card
        // can be dragged left/right to revisit earlier results. See pushHistorySnapshot / goToHistoryIndex.
        let promptHistory = [];

        let historyIndex = -1;

        const MAX_HISTORY = 25;

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

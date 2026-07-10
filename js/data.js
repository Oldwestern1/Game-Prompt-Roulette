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

        // MECHANIC_LINKS: maps each built-in mechanic name to its BoardGameGeek page, so results
        // cards can link out to "learn more" (see cards.js / getLinkFor in this file). Mechanics
        // without an entry here — including any custom mechanic a person adds themselves — fall
        // back to a Wikipedia search instead of going unlinked (see getLinkFor).
        //
        // A few names differ slightly from BGG's official mechanic title, either because this
        // app's list predates a BGG rename, or because several similar app items ("Bag Building" /
        // "Deck Building" / "Pool Building" / "Dice Building") all map to BGG's single combined
        // "Deck, Bag, and Pool Building" mechanic. Three more (Tableau Building, Roll and Write,
        // Closed Economy) point to a BGG "Mechanism:" *family* page rather than an official
        // "boardgamemechanic" page — BGG's community uses these terms constantly but never
        // formalized them as mechanic tags, so the family page (a community-curated list of games
        // using that mechanism, with a definition) is the closest real BGG resource that exists.
        // Closed Economy in particular is an approximate match: it points to BGG's narrower
        // "Closed-Economy Auction" mechanic page (an auction-specific meta-mechanism), since BGG has
        // no page for the broader "money never enters/leaves the game" concept this app means.
        //
        // A remaining few (Engine Building, Drawing Card/Tile, Follow the Leader, Shared Incentive /
        // Market Decay, and the umbrella "Asymmetric Information / Limited Communication") have no
        // BGG mechanic page *or* family page with a confident single match — Engine Building in
        // particular is deliberately not an official BGG tag at all (BGG's community has debated
        // adding it for years; see the forum threads). These are intentionally left out rather than
        // linked to something wrong, and fall back to a Wikipedia search like any other mechanic.
        const MECHANIC_LINKS = {
            "Acting": "https://boardgamegeek.com/boardgamemechanic/2073/acting",
            "Action / Event": "https://boardgamegeek.com/boardgamemechanic/2840/action-event",
            "Action Drafting": "https://boardgamegeek.com/boardgamemechanic/2838/action-drafting",
            "Action Points": "https://boardgamegeek.com/boardgamemechanic/2001/action-points",
            "Action Queue": "https://boardgamegeek.com/boardgamemechanic/2689/action-queue",
            "Action Retrieval": "https://boardgamegeek.com/boardgamemechanic/2839/action-retrieval",
            "Action Timer": "https://boardgamegeek.com/boardgamemechanic/2834/action-timer",
            "Advantage Token": "https://boardgamegeek.com/boardgamemechanic/2847/advantage-token",
            "Algorithmic Resolution": "https://boardgamegeek.com/boardgamemechanic/3140/algorithmic-resolution",
            "Alliances": "https://boardgamegeek.com/boardgamemechanic/2916/alliances",
            "Area Majority / Influence": "https://boardgamegeek.com/boardgamemechanic/2080/area-majority-influence",
            "Area Movement": "https://boardgamegeek.com/boardgamemechanic/2046/area-movement",
            "Area-Impulse": "https://boardgamegeek.com/boardgamemechanic/2021/area-impulse",
            "Asymmetric Roles": "https://boardgamegeek.com/boardgamemechanic/2892/roles-with-asymmetric-information",
            "Auction / Bidding": "https://boardgamegeek.com/boardgamemechanic/2012/auction-bidding",
            "Auction Compensation": "https://boardgamegeek.com/boardgamemechanic/3098/auction-compensation",
            "Auction: Dexterity": "https://boardgamegeek.com/boardgamemechanic/2930/auction-dexterity",
            "Auction: Dutch": "https://boardgamegeek.com/boardgamemechanic/2924/auction-dutch",
            "Auction: Dutch Priority": "https://boardgamegeek.com/boardgamemechanic/2932/auction-dutch-priority",
            "Auction: English": "https://boardgamegeek.com/boardgamemechanic/2918/auction-english",
            "Auction: Fixed Placement": "https://boardgamegeek.com/boardgamemechanic/2931/auction-fixed-placement",
            "Auction: Multiple Lot": "https://boardgamegeek.com/boardgamemechanic/2927/auction-multiple-lot",
            "Auction: Once Around": "https://boardgamegeek.com/boardgamemechanic/2923/auction-once-around",
            "Auction: Sealed Bid": "https://boardgamegeek.com/boardgamemechanic/2920/auction-sealed-bid",
            "Auction: Turn Order Until Pass": "https://boardgamegeek.com/boardgamemechanic/2919/auction-turn-order-until-pass",
            "Automatic Resource Growth": "https://boardgamegeek.com/boardgamemechanic/2903/automatic-resource-growth",
            "Bag Building": "https://boardgamegeek.com/boardgamemechanic/2664/deck-bag-and-pool-building",
            "Betting and Bluffing": "https://boardgamegeek.com/boardgamemechanic/2014/betting-and-bluffing",
            "Bias": "https://boardgamegeek.com/boardgamemechanic/2957/bias",
            "Bids As Wagers": "https://boardgamegeek.com/boardgamemechanic/3097/bids-as-wagers",
            "Bingo": "https://boardgamegeek.com/boardgamemechanic/2999/bingo",
            "Bribery": "https://boardgamegeek.com/boardgamemechanic/2913/bribery",
            "Card Play Conflict Resolution": "https://boardgamegeek.com/boardgamemechanic/2857/card-play-conflict-resolution",
            "Catch the Leader": "https://boardgamegeek.com/boardgamemechanic/2887/catch-the-leader",
            "Chaining": "https://boardgamegeek.com/boardgamemechanic/2956/chaining",
            "Chit-Pull System": "https://boardgamegeek.com/boardgamemechanic/2057/chit-pull-system",
            "Closed Drafting": "https://boardgamegeek.com/boardgamemechanic/2984/closed-drafting",
            "Closed Economy": "https://boardgamegeek.com/boardgamemechanic/2928/closed-economy-auction",
            "Command Cards": "https://boardgamegeek.com/boardgamemechanic/2841/command-cards",
            "Commodity Speculation": "https://boardgamegeek.com/boardgamemechanic/2013/commodity-speculation",
            "Communication Limits": "https://boardgamegeek.com/boardgamemechanic/2893/communication-limits",
            "Connections": "https://boardgamegeek.com/boardgamemechanic/2883/connections",
            "Constrained Bidding": "https://boardgamegeek.com/boardgamemechanic/2922/constrained-bidding",
            "Contracts": "https://boardgamegeek.com/boardgamemechanic/2912/contracts",
            "Cooperative": "https://boardgamegeek.com/boardgamemechanic/2023/cooperative-game",
            "Crayon Rail System": "https://boardgamegeek.com/boardgamemechanic/2010/crayon-rail-system",
            "Critical Hits and Failures": "https://boardgamegeek.com/boardgamemechanic/2854/critical-hits-and-failures",
            "Cube Tower": "https://boardgamegeek.com/boardgamemechanic/2990/cube-tower",
            "Deck Building": "https://boardgamegeek.com/boardgamemechanic/2664/deck-bag-and-pool-building",
            "Deck Construction": "https://boardgamegeek.com/boardgamemechanic/3004/deck-construction",
            "Deduction": "https://boardgamegeek.com/boardgamemechanic/3002/deduction",
            "Delayed Purchase": "https://boardgamegeek.com/boardgamemechanic/2901/delayed-purchase",
            "Dice Building": "https://boardgamegeek.com/boardgamemechanic/2664/deck-bag-and-pool-building",
            "Dice Rolling": "https://boardgamegeek.com/boardgamemechanic/2072/dice-rolling",
            "Die Icon Resolution": "https://boardgamegeek.com/boardgamemechanic/2856/die-icon-resolution",
            "Different Dice Movement": "https://boardgamegeek.com/boardgamemechanic/2950/different-dice-movement",
            "Elapsed Real Time Ending": "https://boardgamegeek.com/boardgamemechanic/2882/elapsed-real-time-ending",
            "Enclosure": "https://boardgamegeek.com/boardgamemechanic/2043/enclosure",
            "End Game Bonuses": "https://boardgamegeek.com/boardgamemechanic/2875/end-game-bonuses",
            "Events": "https://boardgamegeek.com/boardgamemechanic/2850/events",
            "Expiring Actions": "https://boardgamegeek.com/boardgamemechanic/3139/expiring-actions",
            "Facing": "https://boardgamegeek.com/boardgamemechanic/3143/facing",
            "Finale Ending": "https://boardgamegeek.com/boardgamemechanic/2885/finale-ending",
            "Flicking": "https://boardgamegeek.com/boardgamemechanic/2860/flicking",
            "Force Commitment": "https://boardgamegeek.com/boardgamemechanic/2864/force-commitment",
            "Grid Coverage": "https://boardgamegeek.com/boardgamemechanic/2978/grid-coverage",
            "Grid Movement": "https://boardgamegeek.com/boardgamemechanic/2676/grid-movement",
            "Hand Management": "https://boardgamegeek.com/boardgamemechanic/2040/hand-management",
            "Handicaps": "https://boardgamegeek.com/boardgamemechanic/3137/handicaps",
            "Hexagon Grid": "https://boardgamegeek.com/boardgamemechanic/2026/hexagon-grid",
            "Hidden Movement": "https://boardgamegeek.com/boardgamemechanic/2967/hidden-movement",
            "Hidden Roles": "https://boardgamegeek.com/boardgamemechanic/2891/hidden-roles",
            "Hidden Victory Points": "https://boardgamegeek.com/boardgamemechanic/2987/hidden-victory-points",
            "Highest-Lowest Scoring": "https://boardgamegeek.com/boardgamemechanic/2889/highest-lowest-scoring",
            "Hot Potato": "https://boardgamegeek.com/boardgamemechanic/3000/hot-potato",
            "I Cut, You Choose": "https://boardgamegeek.com/boardgamemechanic/2906/i-cut-you-choose",
            "Impulse Movement": "https://boardgamegeek.com/boardgamemechanic/2952/impulse-movement",
            "Income": "https://boardgamegeek.com/boardgamemechanic/2902/income",
            "Increase Value of Unchosen Resources": "https://boardgamegeek.com/boardgamemechanic/2914/increase-value-of-unchosen-resources",
            "Induction": "https://boardgamegeek.com/boardgamemechanic/3003/induction",
            "Interrupts": "https://boardgamegeek.com/boardgamemechanic/2837/interrupts",
            "Investment": "https://boardgamegeek.com/boardgamemechanic/2910/investment",
            "Kill Steal": "https://boardgamegeek.com/boardgamemechanic/2871/kill-steal",
            "King of the Hill": "https://boardgamegeek.com/boardgamemechanic/2886/king-of-the-hill",
            "Ladder Climbing": "https://boardgamegeek.com/boardgamemechanic/2980/ladder-climbing",
            "Lane Battler": "https://boardgamegeek.com/boardgamemechanic/3144/lane-battler",
            "Layering Card/Tile": "https://boardgamegeek.com/boardgamemechanic/3001/layering",
            "Legacy": "https://boardgamegeek.com/boardgamemechanic/2824/legacy-game",
            "Line Drawing": "https://boardgamegeek.com/boardgamemechanic/2039/line-drawing",
            "Line of Sight": "https://boardgamegeek.com/boardgamemechanic/2975/line-of-sight",
            "Loans": "https://boardgamegeek.com/boardgamemechanic/2904/loans",
            "Lose a Turn": "https://boardgamegeek.com/boardgamemechanic/2836/lose-a-turn",
            "Mancala": "https://boardgamegeek.com/boardgamemechanic/2955/mancala",
            "Map Addition": "https://boardgamegeek.com/boardgamemechanic/2959/map-addition",
            "Map Deformation": "https://boardgamegeek.com/boardgamemechanic/2961/map-deformation",
            "Map Reduction": "https://boardgamegeek.com/boardgamemechanic/2960/map-reduction",
            "Market": "https://boardgamegeek.com/boardgamemechanic/2900/market",
            "Matching": "https://boardgamegeek.com/boardgamemechanic/3007/matching",
            "Measurement Movement": "https://boardgamegeek.com/boardgamemechanic/2949/measurement-movement",
            "Melding and Splaying": "https://boardgamegeek.com/boardgamemechanic/2981/melding-and-splaying",
            "Memory": "https://boardgamegeek.com/boardgamemechanic/2047/memory",
            "Minimap Resolution": "https://boardgamegeek.com/boardgamemechanic/2863/minimap-resolution",
            "Modular Board": "https://boardgamegeek.com/boardgamemechanic/2011/modular-board",
            "Move Through Deck": "https://boardgamegeek.com/boardgamemechanic/2962/move-through-deck",
            "Movement Points": "https://boardgamegeek.com/boardgamemechanic/2947/movement-points",
            "Movement Template": "https://boardgamegeek.com/boardgamemechanic/2963/movement-template",
            "Moving Multiple Units": "https://boardgamegeek.com/boardgamemechanic/2958/moving-multiple-units",
            "Multi-Use Cards": "https://boardgamegeek.com/boardgamemechanic/3099/multi-use-cards",
            "Multiple Maps": "https://boardgamegeek.com/boardgamemechanic/2965/multiple-maps",
            "Narrative Choice / Paragraph": "https://boardgamegeek.com/boardgamemechanic/2851/narrative-choice-paragraph",
            "Negotiation": "https://boardgamegeek.com/boardgamemechanic/2915/negotiation",
            "Neighbor Scope": "https://boardgamegeek.com/boardgamemechanic/3104/neighbor-scope",
            "Network and Route Building": "https://boardgamegeek.com/boardgamemechanic/2081/network-and-route-building",
            "Once-Per-Game Abilities": "https://boardgamegeek.com/boardgamemechanic/2846/once-per-game-abilities",
            "Open Drafting": "https://boardgamegeek.com/boardgamemechanic/2041/open-drafting",
            "Order Counters": "https://boardgamegeek.com/boardgamemechanic/2844/order-counters",
            "Ordering": "https://boardgamegeek.com/boardgamemechanic/3101/ordering",
            "Ownership": "https://boardgamegeek.com/boardgamemechanic/2911/ownership",
            "Paper-and-Pencil": "https://boardgamegeek.com/boardgamemechanic/2055/paper-and-pencil",
            "Passed Action Token": "https://boardgamegeek.com/boardgamemechanic/2835/passed-action-token",
            "Pattern Building": "https://boardgamegeek.com/boardgamemechanic/2048/pattern-building",
            "Pattern Movement": "https://boardgamegeek.com/boardgamemechanic/2946/pattern-movement",
            "Pattern Recognition": "https://boardgamegeek.com/boardgamemechanic/2060/pattern-recognition",
            "Physical Removal": "https://boardgamegeek.com/boardgamemechanic/2989/physical-removal",
            "Pick-up and Deliver": "https://boardgamegeek.com/boardgamemechanic/2007/pick-up-and-deliver",
            "Pieces as Map": "https://boardgamegeek.com/boardgamemechanic/2964/pieces-as-map",
            "Player Elimination": "https://boardgamegeek.com/boardgamemechanic/2685/player-elimination",
            "Player Judge": "https://boardgamegeek.com/boardgamemechanic/2865/player-judge",
            "Point to Point Movement": "https://boardgamegeek.com/boardgamemechanic/2078/point-to-point-movement",
            "Polyomino Tile Placement": "https://boardgamegeek.com/boardgamemechanic/2002/tile-placement",
            "Pool Building": "https://boardgamegeek.com/boardgamemechanic/2664/deck-bag-and-pool-building",
            "Predictive Bid": "https://boardgamegeek.com/boardgamemechanic/3006/predictive-bid",
            "Prisoner's Dilemma": "https://boardgamegeek.com/boardgamemechanic/2858/prisoners-dilemma",
            "Programmed Movement": "https://boardgamegeek.com/boardgamemechanic/2953/programmed-movement",
            "Push Your Luck": "https://boardgamegeek.com/boardgamemechanic/2661/push-your-luck",
            "Questions and Answers": "https://boardgamegeek.com/boardgamemechanic/3102/questions-and-answers",
            "Race": "https://boardgamegeek.com/boardgamemechanic/2876/race",
            "Random Production": "https://boardgamegeek.com/boardgamemechanic/2909/random-production",
            "Ratio / Combat Results Table": "https://boardgamegeek.com/boardgamemechanic/2855/ratio-combat-results-table",
            "Re-rolling and Locking": "https://boardgamegeek.com/boardgamemechanic/2870/re-rolling-and-locking",
            "Real-Time": "https://boardgamegeek.com/boardgamemechanic/2831/real-time",
            "Relative Movement": "https://boardgamegeek.com/boardgamemechanic/2954/relative-movement",
            "Resource Queue": "https://boardgamegeek.com/boardgamemechanic/3103/resource-queue",
            "Resource to Move": "https://boardgamegeek.com/boardgamemechanic/2948/resource-to-move",
            "Retirement": "https://boardgamegeek.com/boardgamemechanic/3141/retirement",
            "Rock-Paper-Scissors": "https://boardgamegeek.com/boardgamemechanic/2003/rock-paper-scissors",
            "Roll / Spin and Move": "https://boardgamegeek.com/boardgamemechanic/2035/roll-spin-and-move",
            "Roll and Write": "https://boardgamegeek.com/boardgamefamily/41222/mechanism-roll-and-write",
            "Rondel": "https://boardgamegeek.com/boardgamemechanic/2813/rondel",
            "Scenario / Mission / Campaign Game": "https://boardgamegeek.com/boardgamemechanic/2822/scenario-mission-campaign-game",
            "Score-and-Reset Game": "https://boardgamegeek.com/boardgamemechanic/2823/score-and-reset-game",
            "Secret Deployment": "https://boardgamegeek.com/boardgamemechanic/2016/secret-unit-deployment",
            "Selection Order Bid": "https://boardgamegeek.com/boardgamemechanic/2926/selection-order-bid",
            "Semi-Cooperative Game": "https://boardgamegeek.com/boardgamemechanic/2820/semi-cooperative-game",
            "Set Collection": "https://boardgamegeek.com/boardgamemechanic/2004/set-collection",
            "Simulation": "https://boardgamegeek.com/boardgamemechanic/2070/simulation",
            "Simultaneous Action Selection": "https://boardgamegeek.com/boardgamemechanic/2020/simultaneous-action-selection",
            "Single Loser Game": "https://boardgamegeek.com/boardgamemechanic/2821/single-loser-game",
            "Single Play": "https://boardgamegeek.com/boardgamemechanic/3138/single-play",
            "Slide / Push": "https://boardgamegeek.com/boardgamemechanic/3005/slide-push",
            "Solo": "https://boardgamegeek.com/boardgamemechanic/2819/solo-solitaire-game",
            "Speed Matching": "https://boardgamegeek.com/boardgamemechanic/2991/speed-matching",
            "Spelling": "https://boardgamegeek.com/boardgamemechanic/3113/spelling",
            "Square Grid": "https://boardgamegeek.com/boardgamemechanic/2940/square-grid",
            "Stacking and Balancing": "https://boardgamegeek.com/boardgamemechanic/2988/stacking-and-balancing",
            "Stat Check Resolution": "https://boardgamegeek.com/boardgamemechanic/2853/stat-check-resolution",
            "Static Capture": "https://boardgamegeek.com/boardgamemechanic/2861/static-capture",
            "Stock Holding": "https://boardgamegeek.com/boardgamemechanic/2005/stock-holding",
            "Storytelling": "https://boardgamegeek.com/boardgamemechanic/2027/storytelling",
            "Sudden Death Ending": "https://boardgamegeek.com/boardgamemechanic/2884/sudden-death-ending",
            "Tag Matching": "https://boardgamegeek.com/boardgamemechanic/3100/tags",
            "Take That": "https://boardgamegeek.com/boardgamemechanic/2686/take-that",
            "Tableau Building": "https://boardgamegeek.com/boardgamefamily/27646/mechanism-tableau-building",
            "Targeted Clues": "https://boardgamegeek.com/boardgamemechanic/2866/targeted-clues",
            "Team-Based Game": "https://boardgamegeek.com/boardgamemechanic/2019/team-based-game",
            "Tech Trees / Tracks": "https://boardgamegeek.com/boardgamemechanic/2849/tech-trees-tech-tracks",
            "Three Dimensional Movement": "https://boardgamegeek.com/boardgamemechanic/2944/three-dimensional-movement",
            "Tile Placement": "https://boardgamegeek.com/boardgamemechanic/2002/tile-placement",
            "Track Movement": "https://boardgamegeek.com/boardgamemechanic/2939/track-movement",
            "Trading": "https://boardgamegeek.com/boardgamemechanic/2008/trading",
            "Traitor": "https://boardgamegeek.com/boardgamemechanic/2814/traitor-game",
            "Trick-Taking": "https://boardgamegeek.com/boardgamemechanic/2009/trick-taking",
            "Tug of War": "https://boardgamegeek.com/boardgamemechanic/2888/tug-of-war",
            "Turn Order: Auction": "https://boardgamegeek.com/boardgamemechanic/2827/turn-order-auction",
            "Turn Order: Claim Action": "https://boardgamegeek.com/boardgamemechanic/2829/turn-order-claim-action",
            "Turn Order: Pass Order": "https://boardgamegeek.com/boardgamemechanic/2830/turn-order-pass-order",
            "Turn Order: Progressive": "https://boardgamegeek.com/boardgamemechanic/2828/turn-order-progressive",
            "Turn Order: Random": "https://boardgamegeek.com/boardgamemechanic/2985/turn-order-random",
            "Turn Order: Role Order": "https://boardgamegeek.com/boardgamemechanic/2833/turn-order-role-order",
            "Turn Order: Stat-Based": "https://boardgamegeek.com/boardgamemechanic/2826/turn-order-stat-based",
            "Turn Order: Time Track": "https://boardgamegeek.com/boardgamemechanic/2663/turn-order-time-track",
            "Variable Phase Order": "https://boardgamegeek.com/boardgamemechanic/2079/variable-phase-order",
            "Variable Player Powers": "https://boardgamegeek.com/boardgamemechanic/2015/variable-player-powers",
            "Variable Set-up": "https://boardgamegeek.com/boardgamemechanic/2897/variable-set-up",
            "Victory Points as a Resource": "https://boardgamegeek.com/boardgamemechanic/2874/victory-points-as-a-resource",
            "Visual Restriction": "https://boardgamegeek.com/boardgamemechanic/3142/visual-restriction",
            "Voting": "https://boardgamegeek.com/boardgamemechanic/2017/voting",
            "Worker Placement": "https://boardgamegeek.com/boardgamemechanic/2082/worker-placement",
            "Worker Placement with Dice Workers": "https://boardgamegeek.com/boardgamemechanic/2935/worker-placement-with-dice-workers",
            "Worker Placement, Different Worker Types": "https://boardgamegeek.com/boardgamemechanic/2933/worker-placement-different-worker-types",
            "Zone of Control": "https://boardgamegeek.com/boardgamemechanic/2974/zone-of-control",
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

        // ─── RESULT-CARD LINKS ──────────────────────────────────────────────────────
        // LINK_MAPS: per-category maps of hand-picked "learn more" URLs, keyed by item name.
        // Only "mechanics" has one (MECHANIC_LINKS, above) — BGG's mechanic pages are a single,
        // reliable, one-to-one source. Themes and components have no equivalent authoritative
        // source, so those two are left empty and always fall through to the Wikipedia search
        // fallback in getLinkFor() below. Add entries here any time you want a specific item to
        // point somewhere better than the auto-generated guess.
        const LINK_MAPS = { mechanics: MECHANIC_LINKS, themes: {}, components: {} };

        // Finds which named group inside a masterData category an item belongs to (e.g. "Word
        // Inspiration" inside themes) by searching the live masterData — including any custom items
        // a person has added, since those live in the same group array as the built-ins. Returns
        // null if the item can't be found in any group.
        function getGroupFor(categoryKey, itemName) {
            const groups = masterData[categoryKey];
            if (!groups) return null;
            for (const groupName of Object.keys(groups)) {
                if (groups[groupName].includes(itemName)) return groupName;
            }
            return null;
        }

        // Strips a leading count/article word ("18 ", "a ", "Two ") from an item name before it's
        // used as a search query, so "18 Cards" and "a Deck of Cards" search for their actual
        // subject ("Cards" / "Deck of Cards") instead of being thrown at Wikipedia verbatim.
        const LEADING_COUNT_WORD = /^(\d+|a|an|the|one|two|three|four|five|six|seven|eight|nine|ten)\s+/i;
        function normalizeForSearch(name) {
            let out = name, prev;
            do { prev = out; out = out.replace(LEADING_COUNT_WORD, ''); } while (out !== prev);
            return out.trim() || name; // never search for an empty string
        }

        // Builds a Wikipedia "I'm feeling lucky" search URL: jumps straight to the article when
        // there's a confident title match, otherwise shows a normal search-results page. Used
        // instead of guessing an article slug directly (e.g. `/wiki/${name}`), since plenty of item
        // names don't exactly match a Wikipedia title (plurals, disambiguation, multi-word phrases)
        // — a search is far more forgiving and never links to a dead page.
        function wikipediaSearchLink(name) {
            const query = normalizeForSearch(name);
            return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}&title=Special:Search&go=Go`;
        }

        // Builds a direct Merriam-Webster lookup for a single vocabulary word. Unlike theme/component
        // names, single dictionary words map onto a URL slug reliably (lowercase, no punctuation), so
        // this is a direct link rather than a search — it's used for the built-in INSPIRATION_SET
        // words and for anything a person adds to the "Word Inspiration" group themselves.
        function dictionaryLink(name) {
            return `https://www.merriam-webster.com/dictionary/${encodeURIComponent(name.trim().toLowerCase())}`;
        }

        // Resolves the "learn more" link for a result card, if any:
        //   1. A hand-picked URL in LINK_MAPS always wins when one exists (currently mechanics only).
        //   2. Themes in the "Vibes" group (Cozy, Grim, ...) get no link — they're moods, not subjects.
        //   3. Themes in the "Word Inspiration" group get a dictionary link instead of Wikipedia — UNLESS
        //      the name is a SCAMPER prompt verb (Combine, Reverse, ...), which gets no link, since
        //      "look up the dictionary definition of Combine" isn't useful the way it is for Redolent
        //      or Sonder.
        //   4. Everything else falls back to a Wikipedia search.
        // Applies to every item including custom ones typed into the "Add an item…" box — group
        // membership is read live from masterData, so a custom word added to "Word Inspiration" gets
        // a dictionary link automatically, without needing its own curated entry.
        function getLinkFor(categoryKey, itemName) {
            const curated = LINK_MAPS[categoryKey] && LINK_MAPS[categoryKey][itemName];
            if (curated) return { url: curated, source: 'BoardGameGeek' };

            if (categoryKey === 'themes') {
                const group = getGroupFor('themes', itemName);
                if (group === 'Vibes') return null;
                if (group === 'Word Inspiration') {
                    const isScamperVerb = Object.keys(SCAMPER).some(k => k.toLowerCase() === itemName.toLowerCase());
                    if (isScamperVerb) return null;
                    return { url: dictionaryLink(itemName), source: 'Merriam-Webster' };
                }
            }
            return { url: wikipediaSearchLink(itemName), source: 'Wikipedia' };
        }

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

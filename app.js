// Anti-inspect & right-click protection
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.shiftKey && e.key === 'i')
    ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

// DevTools open detection (deterrent — cannot fully prevent)
let devtoolsOpen = false;
const detectDevTools = () => {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if (widthDiff || heightDiff) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            document.title = '🚫 INSPECTOR DETECTED';
            document.body.style.opacity = '0.1';
            setTimeout(() => {
                document.title = 'AmazeMC | Survival Economy';
                document.body.style.opacity = '1';
                devtoolsOpen = false;
            }, 3000);
        }
    }
};
setInterval(detectDevTools, 1000);

const starContainer = document.getElementById('stars-container');
        for (let i = 0; i < 120; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDelay = (Math.random() * 5) + 's';
            star.style.animationDuration = (2 + Math.random() * 3) + 's';
            starContainer.appendChild(star);
        }

        const cursor = document.getElementById('custom-cursor');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        const scrollBtn = document.getElementById('scroll-top');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        window.addEventListener('scroll', () => {
            scrollBtn.style.display = window.scrollY > 600 ? 'flex' : 'none';
        });

        const updateCursorHandlers = () => {
            document.querySelectorAll('.clickable, button, a, [onclick]').forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
            });
        };

        // Minecraft Particles
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const colors = ['#FFD700', '#ff4444', '#55ff55', '#5555ff', '#ff55ff', '#ffaa00', '#55ffff'];

        function spawnParticles(x, y, count) {
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 6,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3 - 1,
                    life: 1,
                    decay: 0.015 + Math.random() * 0.02,
                    size: 2 + Math.random() * 4,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }

        // XP Orb particles - floating green orbs
        let xpOrbs = [];
        function spawnXpOrbs(count) {
            for (let i = 0; i < count; i++) {
                xpOrbs.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height + 20 + Math.random() * 40,
                    size: 4 + Math.random() * 6,
                    speed: 0.3 + Math.random() * 0.5,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: 0.02 + Math.random() * 0.03,
                    life: 1,
                    opacity: 0.3 + Math.random() * 0.3
                });
            }
        }
        spawnXpOrbs(15);

        function animateXpOrbs() {
            for (let i = xpOrbs.length - 1; i >= 0; i--) {
                const o = xpOrbs[i];
                o.y -= o.speed;
                o.wobble += o.wobbleSpeed;
                o.x += Math.sin(o.wobble) * 0.3;
                o.life -= 0.002;
                if (o.life <= 0 || o.y < -30) {
                    xpOrbs.splice(i, 1);
                    continue;
                }
                ctx.globalAlpha = o.opacity * o.life;
                ctx.fillStyle = '#55ff55';
                ctx.shadowColor = '#55ff55';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                // Inner highlight
                ctx.globalAlpha = o.opacity * o.life * 0.4;
                ctx.fillStyle = '#88ff88';
                ctx.beginPath();
                ctx.arc(o.x - 1, o.y - 1, o.size / 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            if (xpOrbs.length < 10) spawnXpOrbs(5);
        }

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (Math.random() > 0.5) spawnParticles(e.clientX, e.clientY, 1);
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02;
                p.life -= p.decay;
                if (p.life <= 0) { particles.splice(i, 1); continue; }
                ctx.globalAlpha = p.life * 0.5;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            }
            ctx.globalAlpha = 1;
            animateXpOrbs();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Loading screen
        window.addEventListener('load', () => {
            updateCursorHandlers();
            serverStatus();
            const fill = document.getElementById('loading-fill');
            const loadingTexts = ['PREPARING SPAWN...', 'LOADING CHUNKS...', 'GENERATING TERRAIN...', 'ALMOST READY...'];
            let w = 0;
            let textIdx = 0;
            const timer = setInterval(() => {
                w += Math.random() * 22;
                if (w >= 100) {
                    w = 100;
                    clearInterval(timer);
                    setTimeout(() => {
                        document.getElementById('loading-screen').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('loading-screen').style.display = 'none';
                            document.getElementById('main-content').style.opacity = '1';
                            typeWriter();
                        }, 800);
                    }, 400);
                }
                fill.style.width = w + '%';
                if (w > 30 && textIdx === 0) {
                    document.getElementById('loading-text').textContent = loadingTexts[1];
                    textIdx = 1;
                }
                if (w > 60 && textIdx === 1) {
                    document.getElementById('loading-text').textContent = loadingTexts[2];
                    textIdx = 2;
                }
                if (w > 85 && textIdx === 2) {
                    document.getElementById('loading-text').textContent = loadingTexts[3];
                    textIdx = 3;
                }
            }, 150);
        });

        // Typewriter
        let typeIndex = 0;
        const typeText = 'ECONOMY SURVIVAL';
        function typeWriter() {
            const el = document.getElementById('typewriter');
            if (typeIndex < typeText.length) {
                el.textContent += typeText[typeIndex];
                typeIndex++;
                setTimeout(typeWriter, 80);
            }
        }

        // Server Status via mcsrvstat.us
        async function serverStatus() {
            const dot = document.getElementById('status-dot');
            const text = document.getElementById('status-text');
            const players = document.getElementById('players-text');
            try {
                const res = await fetch('https://api.mcsrvstat.us/3/amazemc.zoho.to:8107');
                const data = await res.json();
                if (data.online) {
                    dot.className = 'status-dot online';
                    text.textContent = 'SERVER ONLINE';
                    const pc = data.players ? (data.players.online || 0) : 0;
                    const pm = data.players ? (data.players.max || 0) : 0;
                    players.textContent = pc + ' / ' + pm + ' ONLINE';
                    document.getElementById('stat-players').textContent = pc;
                    document.getElementById('stat-max').textContent = pm;
                    document.getElementById('stat-uptime').textContent = '● ONLINE';
                    document.getElementById('stat-uptime').style.color = '#44ff44';
                    if (data.version) {
                        document.getElementById('stat-version').textContent = data.version;
                    }
                } else {
                    dot.className = 'status-dot offline';
                    text.textContent = 'SERVER OFFLINE';
                    players.textContent = '-- OFFLINE';
                    document.getElementById('stat-players').textContent = '0';
                    document.getElementById('stat-uptime').textContent = '● OFFLINE';
                    document.getElementById('stat-uptime').style.color = '#ff4444';
                }
            } catch (e) {
                dot.className = 'status-dot offline';
                text.textContent = 'COULD NOT REACH';
                players.textContent = '-- UNKNOWN';
                document.getElementById('stat-players').textContent = '?';
                document.getElementById('stat-uptime').textContent = '● UNKNOWN';
                document.getElementById('stat-uptime').style.color = '#ffaa00';
            }
        }

        // Modal Functions
        function openStaff() {
            modalContent.innerHTML = `
                <h2 class="text-6xl text-white mb-8">THE HIGH COUNCIL</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    <div class="staff-card text-center">
                        <h3 class="text-4xl">Raj Plays</h3>
                        <p class="text-red-600 uppercase tracking-widest text-xl font-bold">Owner</p>
                    </div>
                    <div class="staff-card text-center">
                        <h3 class="text-4xl">Nokwt1ho</h3>
                        <p class="text-zinc-400 uppercase tracking-widest text-xl font-bold">Admin</p>
                    </div>
                    <div class="staff-card text-center">
                        <h3 class="text-4xl">NotHyperBoiz1</h3>
                        <p class="text-zinc-400 uppercase tracking-widest text-xl font-bold">Admin</p>
                    </div>
                </div>
            `;
            showModal();
        }

        function openLaw() {
            modalContent.innerHTML = `
                <svg class="mc-icon mc-icon-xl" viewBox="0 0 16 16" style="margin-bottom:0.5rem"><use href="#icon-law-book"/></svg>
                <h2 class="text-6xl text-white mb-4">SERVER RULES</h2>
                <div class="text-left bg-zinc-800 p-6 border-4 border-black text-xl space-y-2 law-list max-h-[50vh] overflow-y-auto">
                    <p><span>01.</span> Appropriate Usernames & Skins: Please use appropriate and legal usernames and Minecraft skins on our server.</p>
                    <p><span>02.</span> No Griefing: Strictly prohibited on AmazeMC. Do not destroy what is not yours.</p>
                    <p><span>03.</span> No Begging: Do not beg for free stuff. Staff take this very seriously.</p>
                    <p><span>04.</span> Unfair Advantages: Do not use any clients or mods (X-ray, hacks, etc.) that give you an unfair advantage.</p>
                    <p><span>05.</span> Harassment: Any kind of sexual or personal harassment is not allowed.</p>
                    <p><span>06.</span> Staff Respect: Disrespecting staff can lead to an instant, permanent ban.</p>
                    <p><span>07.</span> No Admin Abuse: If a staff member is destroying the server, report it via a ticket immediately.</p>
                    <p><span>08.</span> No Bots: Use of Baritone or any programmed scripts/bots will lead to an instant IP ban.</p>
                    <p><span>09.</span> No Advertising: This includes sending links or other server IPs. This is taken very seriously.</p>
                    <p><span>10.</span> Have Patience & Common Sense: Be patient with tickets. Use common sense and do not argue if you are at fault.</p>
                    <p><span>11.</span> General Respect: Be respectful towards everyone in the server.</p>
                    <p><span>12.</span> Lag Machines: Creating machines intended to drop TPS or lag the server will result in a ban.</p>
                </div>
            `;
            showModal();
        }

        function openVote() {
            modalContent.innerHTML = `
                <svg class="mc-icon mc-icon-xl" viewBox="0 0 16 16" style="margin-bottom:0.5rem"><use href="#icon-vote-paper"/></svg>
                <h2 class="text-6xl text-white mb-4">VOTE FOR US</h2>
                <p class="text-2xl text-zinc-300 mb-8">Support the realm and earn legendary rewards in-game!</p>
                <div class="grid gap-4">
                    <a href="https://topminecraftservers.org/server/38964" target="_blank" class="mc-button clickable">VOTE ON TOPMINECRAFTSERVERS</a>
                    <a href="https://best-minecraft-servers.co/server-amazemc.25606" target="_blank" class="mc-button clickable">VOTE ON BEST-MINECRAFT-SERVERS</a>
                </div>
                <hr class="mc-hr">
                <p class="text-xl text-zinc-400">Vote daily to earn Vote Keys and open exclusive crates!</p>
            `;
            showModal();
        }

        function openWiki() {
            modalContent.innerHTML = `
                <svg class="mc-icon mc-icon-xl" viewBox="0 0 16 16" style="margin-bottom:0.5rem"><use href="#icon-wiki-book"/></svg>
                <h2 class="text-6xl text-white mb-6">GUIDE & COMMANDS</h2>
                <div class="space-y-6 text-left max-h-[55vh] overflow-y-auto pr-2">
                    <div class="wiki-section">
                        <h3><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-rocket"/></svg> Getting Started</h3>
                        <p>1. Join the server using <b>AMAZEMC.ZOHO.TO:8107</b> (MC 1.20.4)</p>
                        <p>2. Use <span class="cmd-block">/spawn</span> to return to spawn</p>
                        <p>3. Use <span class="cmd-block">/wild</span> to teleport to the wilderness and claim your land</p>
                        <p>4. Use <span class="cmd-block">/claim</span> to protect the area you're standing in</p>
                        <p>5. Start mining, farming, and trading to earn money!</p>
                    </div>
                    <div class="wiki-section">
                        <h3><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-gold-ingot"/></svg> Economy Commands</h3>
                        <ul>
                            <li><span class="cmd-block">/bal</span> - Check your balance</li>
                            <li><span class="cmd-block">/pay [player] [amount]</span> - Send money</li>
                            <li><span class="cmd-block">/baltop</span> - Richest players</li>
                            <li><span class="cmd-block">/shop</span> - Open server shop</li>
                            <li><span class="cmd-block">/withdraw [amount]</span> - Withdraw money as item</li>
                        </ul>
                    </div>
                    <div class="wiki-section">
                        <h3><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-grass-block"/></svg> Land Commands</h3>
                        <ul>
                            <li><span class="cmd-block">/claim</span> - Claim your current chunk</li>
                            <li><span class="cmd-block">/unclaim</span> - Unclaim your chunk</li>
                            <li><span class="cmd-block">/trust [player]</span> - Give build rights</li>
                            <li><span class="cmd-block">/untrust [player]</span> - Remove build rights</li>
                            <li><span class="cmd-block">/trustlist</span> - See trusted players</li>
                            <li><span class="cmd-block">/claimslist</span> - View all your claims</li>
                        </ul>
                    </div>
                    <div class="wiki-section">
                        <h3><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-pickaxe"/></svg> Jobs & Skills</h3>
                        <ul>
                            <li><span class="cmd-block">/jobs</span> - Browse available jobs</li>
                            <li><span class="cmd-block">/jobs join [job]</span> - Join a job</li>
                            <li><span class="cmd-block">/jobs leave [job]</span> - Leave a job</li>
                            <li><span class="cmd-block">/jobs stats</span> - View your progress</li>
                        </ul>
                        <p class="mt-2">Available Jobs: <b>Miner, Woodcutter, Farmer, Hunter, Fisherman, Builder</b></p>
                    </div>
                    <div class="wiki-section">
                        <h3><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-xp-bottle"/></svg> Player Commands</h3>
                        <ul>
                            <li><span class="cmd-block">/tpa [player]</span> - Request to teleport</li>
                            <li><span class="cmd-block">/tpahere [player]</span> - Request player to you</li>
                            <li><span class="cmd-block">/home [name]</span> - Teleport to your home</li>
                            <li><span class="cmd-block">/sethome [name]</span> - Set a home</li>
                            <li><span class="cmd-block">/ah</span> - Open auction house</li>
                            <li><span class="cmd-block">/mail</span> - Check your mail</li>
                            <li><span class="cmd-block">/msg [player] [message]</span> - Private message</li>
                            <li><span class="cmd-block">/discord</span> - Get Discord invite link</li>
                        </ul>
                    </div>
                </div>
            `;
            showModal();
        }

        function openRanks() {
            modalContent.innerHTML = `
                <svg class="mc-icon mc-icon-xl" viewBox="0 0 16 16" style="margin-bottom:0.5rem"><use href="#icon-crown"/></svg>
                <h2 class="text-6xl text-white mb-6">DONOR RANKS</h2>
                <p class="text-xl text-zinc-300 mb-6">Unlock exclusive perks by supporting the server</p>
                <div class="grid md:grid-cols-2 gap-4 text-left max-h-[55vh] overflow-y-auto pr-2">
                    <div class="rank-card rank-free">
                        <div class="rank-name">A Rank</div>
                        <div class="rank-price text-zinc-500">FREE</div>
                        <div class="rank-perks">/home 1, /tpa, /spawn, /wild, /claim</div>
                    </div>
                    <div class="rank-card rank-b">
                        <div class="rank-name" style="color:#55ff55">B Rank</div>
                        <div class="rank-price">$5.00</div>
                        <div class="rank-perks">/home 2, /kit starter, colored chat, /msg</div>
                    </div>
                    <div class="rank-card rank-c">
                        <div class="rank-name" style="color:#5555ff">C Rank</div>
                        <div class="rank-price">$10.00</div>
                        <div class="rank-perks">/home 3, /fly in claim, /hat, /craft, anvil</div>
                    </div>
                    <div class="rank-card rank-d">
                        <div class="rank-name" style="color:#ff55ff">D Rank</div>
                        <div class="rank-price">$20.00</div>
                        <div class="rank-perks">/home 5, /nick, /grindstone, /carto, /stonecutter</div>
                    </div>
                    <div class="rank-card rank-vip">
                        <div class="rank-name" style="color:#ffaa00">VIP</div>
                        <div class="rank-price">$35.00</div>
                        <div class="rank-perks">/home 10, /feed, /heal, join full, /echest</div>
                    </div>
                    <div class="rank-card rank-mvp">
                        <div class="rank-name" style="color:#ff5555">MVP</div>
                        <div class="rank-price">$50.00</div>
                        <div class="rank-perks">/home 15, /fix, /near, particle trail, glow</div>
                    </div>
                    <div class="rank-card rank-mvpp">
                        <div class="rank-name" style="color:#ff0000">MVP+</div>
                        <div class="rank-price">$75.00</div>
                        <div class="rank-perks">/home 20, custom tag, /fly everywhere, /ptime</div>
                    </div>
                    <div class="rank-card rank-sponsor">
                        <div class="rank-name" style="color:var(--mc-gold)">SPONSOR</div>
                        <div class="rank-price">$100.00</div>
                        <div class="rank-perks">/home 30, all perks, special prefix, discord role</div>
                    </div>
                </div>
                <hr class="mc-hr">
                <p class="text-lg text-zinc-400">Purchase ranks via our Store or ask in Discord!</p>
            `;
            showModal();
        }

        function openStore() {
            modalContent.innerHTML = `
                <svg class="mc-icon mc-icon-xl" viewBox="0 0 16 16" style="margin-bottom:0.5rem"><use href="#icon-chest"/></svg>
                <h2 class="text-6xl text-white mb-6">SERVER STORE</h2>
                <p class="text-xl text-zinc-300 mb-6">Support AmazeMC and get awesome rewards</p>
                <div class="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                    <h3 class="text-3xl text-left text-white uppercase tracking-wider"><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-medal"/></svg> Ranks</h3>
                    <div class="store-item" onclick="openRanks()" style="cursor:pointer">
                        <div>
                            <div class="item-name">B Rank → Sponsor</div>
                            <div class="text-zinc-400 text-sm">View all rank perks</div>
                        </div>
                        <div class="item-price">$5 - $100</div>
                    </div>
                    <hr class="mc-hr">
                    <h3 class="text-3xl text-left text-white uppercase tracking-wider"><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-key"/></svg> Crate Keys</h3>
                    <div class="store-item">
                        <div class="item-name">Vote Key</div>
                        <div class="text-zinc-400 text-sm">Common rewards</div>
                        <div class="item-price">$1.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">Rare Key</div>
                        <div class="text-zinc-400 text-sm">Uncommon rewards</div>
                        <div class="item-price">$3.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">Legendary Key</div>
                        <div class="text-zinc-400 text-sm">Rare & epic loot</div>
                        <div class="item-price">$5.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">Godly Key</div>
                        <div class="text-zinc-400 text-sm">Best loot in the game!</div>
                        <div class="item-price">$10.00</div>
                    </div>
                    <hr class="mc-hr">
                    <h3 class="text-3xl text-left text-white uppercase tracking-wider"><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-gold-ingot"/></svg> In-Game Currency</h3>
                    <div class="store-item">
                        <div class="item-name">10,000 Coins</div>
                        <div class="item-price">$5.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">25,000 Coins</div>
                        <div class="item-price">$10.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">60,000 Coins</div>
                        <div class="item-price">$20.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">200,000 Coins</div>
                        <div class="item-price">$50.00</div>
                    </div>
                    <hr class="mc-hr">
                    <h3 class="text-3xl text-left text-white uppercase tracking-wider"><svg class="mc-icon" viewBox="0 0 16 16" style="vertical-align:middle;margin-top:-2px"><use href="#icon-gift"/></svg> Bundles</h3>
                    <div class="store-item">
                        <div class="item-name">Starter Bundle</div>
                        <div class="text-zinc-400 text-sm">C Rank + 10k Coins + 5 Keys</div>
                        <div class="item-price">$15.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">Pro Bundle</div>
                        <div class="text-zinc-400 text-sm">D Rank + 25k Coins + 10 Keys + Tag</div>
                        <div class="item-price">$40.00</div>
                    </div>
                    <div class="store-item">
                        <div class="item-name">Ultimate Bundle</div>
                        <div class="text-zinc-400 text-sm">MVP + 100k Coins + 25 Keys + Discord Role</div>
                        <div class="item-price">$100.00</div>
                    </div>
                </div>
                <hr class="mc-hr">
                <p class="text-lg text-zinc-400">Purchase via Discord ticket or at our web store!</p>
            `;
            showModal();
        }

        function showModal() {
            modalOverlay.style.display = 'flex';
            setTimeout(() => {
                modalOverlay.classList.add('active');
                updateCursorHandlers();
            }, 10);
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            setTimeout(() => modalOverlay.style.display = 'none', 300);
        }

        function copyIP() {
            const ip = 'amazemc.zoho.to:8107';
            const el = document.createElement('textarea');
            el.value = ip;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            showNote('IP COPIED!');
        }

        function showNote(msg) {
            const note = document.getElementById('notification');
            note.innerText = msg;
            note.style.display = 'block';
            setTimeout(() => note.style.display = 'none', 2000);
        }

        // Refresh server status every 60 seconds
        setInterval(serverStatus, 60000);

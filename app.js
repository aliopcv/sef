/* -------------------------------------------------------------
   عراق لايف - IRAQ LIVE FOOTBALL STREAMING
   JavaScript Core Engine (Device Image Upload, Score Counters & Secret Admin Access)
------------------------------------------------------------- */

(function () {
    'use strict';

    // Initial Sample Matches
    const DEFAULT_MATCHES = [
        {
            id: 'match-1',
            tournament: 'الدوري العراقي الممتاز 🇮🇶',
            team1: 'القوة الجوية',
            logo1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Al-Quwa_Al-Jawiya_logo.png/220px-Al-Quwa_Al-Jawiya_logo.png',
            team2: 'الشرطة',
            logo2: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Al-Shorta_SC_logo.png/220px-Al-Shorta_SC_logo.png',
            status: 'live',
            score1: 2,
            score2: 1,
            matchTime: '72\' (الشوط الثاني)',
            channel: 'الرابعة العراقية الرياضية HD',
            commentator: 'علي لفته',
            streamLink: '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig" allowfullscreen></iframe>',
            streamLink2: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFeatured: true
        },
        {
            id: 'match-2',
            tournament: 'تصفيات كأس العالم 🏆',
            team1: 'العراق 🇮🇶',
            logo1: '',
            team2: 'اليابان 🇯🇵',
            logo2: '',
            status: 'upcoming',
            score1: 0,
            score2: 0,
            matchTime: 'اليوم - 09:00 مساءً',
            channel: 'الكأس HD 1 / beIN Sports 1',
            commentator: 'حفيظ دراجي',
            streamLink: 'https://www.youtube.com/embed/live_demo',
            streamLink2: '',
            isFeatured: false
        },
        {
            id: 'match-3',
            tournament: 'الدوري الإسباني - الكلاسيكو 🇪🇸',
            team1: 'ريال مدريد',
            logo1: '',
            team2: 'برشلونة',
            logo2: '',
            status: 'live',
            score1: 1,
            score2: 0,
            matchTime: '38\' (الشوط الأول)',
            channel: 'beIN Sports HD 1 Premium',
            commentator: 'عصام الشوالي',
            streamLink: '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
            streamLink2: '',
            isFeatured: false
        },
        {
            id: 'match-4',
            tournament: 'الدوري العراقي الممتاز 🇮🇶',
            team1: 'الزوراء',
            logo1: '',
            team2: 'أربيل',
            logo2: '',
            status: 'today',
            score1: 0,
            score2: 0,
            matchTime: 'اليوم - 06:30 مساءً',
            channel: 'العراقية الرياضية HD',
            commentator: 'رعد ناهي',
            streamLink: '',
            streamLink2: '',
            isFeatured: false
        },
        {
            id: 'match-5',
            tournament: 'دوري أبطال أوروبا 🇪🇺',
            team1: 'باريس سان جيرمان',
            logo1: '',
            team2: 'مانشستر سيتي',
            logo2: '',
            status: 'finished',
            score1: 3,
            score2: 2,
            matchTime: 'انتهت المبارة (كاملة)',
            channel: 'beIN Sports HD 2',
            commentator: 'خليل البلوشي',
            streamLink: '',
            streamLink2: '',
            isFeatured: false
        }
    ];

    const STORAGE_KEY = 'iraq_live_matches_data';
    const ADMIN_PASSCODE = '0000';

    let matches = [];
    let currentFilter = 'all';
    let currentSearchQuery = '';
    let activeMatchForWatchPage = null;

    // Base64 upload cache
    let uploadedLogo1Base64 = '';
    let uploadedLogo2Base64 = '';

    // Secret Key Sequence Buffer
    let keyBuffer = '';

    const isWatchPage = window.location.pathname.includes('watch.html');

    // DOM Elements Cache
    const el = {
        liveMatchesCount: document.getElementById('liveMatchesCount'),
        matchesCountLabel: document.getElementById('matchesCountLabel'),
        heroFeaturedSection: document.getElementById('heroFeaturedSection'),
        matchesGrid: document.getElementById('matchesGrid'),
        emptyState: document.getElementById('emptyState'),
        filterTabs: document.getElementById('filterTabs'),
        searchInput: document.getElementById('searchInput'),

        // Secret Admin Triggers
        secretLogoTrigger: document.getElementById('secretLogoTrigger'),
        secretFooterDot: document.getElementById('secretFooterDot'),

        // Watch Page
        watchScoreboard: document.getElementById('watchScoreboard'),
        videoContainer: document.getElementById('videoContainer'),
        serverButtons: document.getElementById('serverButtons'),
        watchDetailsGrid: document.getElementById('watchDetailsGrid'),
        otherMatchesGrid: document.getElementById('otherMatchesGrid'),

        // Admin Elements
        adminLoginModal: document.getElementById('adminLoginModal'),
        closeAdminLoginModal: document.getElementById('closeAdminLoginModal'),
        adminLoginForm: document.getElementById('adminLoginForm'),
        adminPinInput: document.getElementById('adminPinInput'),
        adminLoginError: document.getElementById('adminLoginError'),
        adminPanel: document.getElementById('adminPanel'),
        closeAdminPanelBtn: document.getElementById('closeAdminPanelBtn'),
        resetDataBtn: document.getElementById('resetDataBtn'),
        matchForm: document.getElementById('matchForm'),
        matchIdInput: document.getElementById('matchIdInput'),
        formTitle: document.getElementById('formTitle'),
        cancelEditBtn: document.getElementById('cancelEditBtn'),
        saveMatchBtn: document.getElementById('saveMatchBtn'),
        adminMatchesTableBody: document.getElementById('adminMatchesTableBody'),

        // Form Inputs
        tournamentInput: document.getElementById('tournamentInput'),
        team1Input: document.getElementById('team1Input'),
        team2Input: document.getElementById('team2Input'),
        logoFile1Input: document.getElementById('logoFile1Input'),
        logoFile2Input: document.getElementById('logoFile2Input'),
        logo1Preview: document.getElementById('logo1Preview'),
        logo2Preview: document.getElementById('logo2Preview'),
        statusInput: document.getElementById('statusInput'),
        
        // Score Counters
        formTeam1Name: document.getElementById('formTeam1Name'),
        formTeam2Name: document.getElementById('formTeam2Name'),
        score1Input: document.getElementById('score1Input'),
        score2Input: document.getElementById('score2Input'),
        formScore1Minus: document.getElementById('formScore1Minus'),
        formScore1Plus: document.getElementById('formScore1Plus'),
        formScore2Minus: document.getElementById('formScore2Minus'),
        formScore2Plus: document.getElementById('formScore2Plus'),

        matchTimeInput: document.getElementById('matchTimeInput'),
        channelInput: document.getElementById('channelInput'),
        commentatorInput: document.getElementById('commentatorInput'),
        streamLinkInput: document.getElementById('streamLinkInput'),
        streamLink2Input: document.getElementById('streamLink2Input'),
        isFeaturedInput: document.getElementById('isFeaturedInput')
    };

    // -------------------------------------------------------------
    // Data Management
    // -------------------------------------------------------------
    function loadMatches() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                matches = JSON.parse(stored);
            } else {
                matches = [...DEFAULT_MATCHES];
                saveMatches();
            }
        } catch (err) {
            console.error('Error loading matches:', err);
            matches = [...DEFAULT_MATCHES];
        }
    }

    function saveMatches() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
        } catch (err) {
            console.error('Error saving matches:', err);
        }
    }

    function resetToDefaultMatches() {
        if (confirm('هل أنت تأكد من استعادة قائمة المباريات المبدئية؟')) {
            matches = JSON.parse(JSON.stringify(DEFAULT_MATCHES));
            saveMatches();
            refreshCurrentPage();
            renderAdminTable();
            alert('تم استعادة المباريات المبدئية بنجاح!');
        }
    }

    function refreshCurrentPage() {
        if (isWatchPage) {
            renderWatchPage();
        } else {
            renderIndexPage();
        }
    }

    function getTeamLogoHTML(logoUrl, teamName) {
        if (logoUrl && logoUrl.trim().length > 5) {
            return `<img src="${escapeHTML(logoUrl)}" alt="${escapeHTML(teamName)}" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png';">`;
        }
        return `<i class="fa-solid fa-shield-halved team-logo-fallback"></i>`;
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'live':
                return `<span class="match-status-tag live"><span class="pulse-dot"></span> مباشر الآن</span>`;
            case 'upcoming':
            case 'today':
                return `<span class="match-status-tag upcoming"><i class="fa-regular fa-clock"></i> قادماً</span>`;
            case 'finished':
                return `<span class="match-status-tag finished"><i class="fa-solid fa-check"></i> انتهت</span>`;
            default:
                return `<span class="match-status-tag">${escapeHTML(status)}</span>`;
        }
    }

    function formatMatchScore(match) {
        if (match.status === 'upcoming' && (match.score1 === 0 && match.score2 === 0)) {
            return 'VS';
        }
        return `${match.score1 ?? 0} - ${match.score2 ?? 0}`;
    }

    // -------------------------------------------------------------
    // Page Renderers
    // -------------------------------------------------------------
    function renderIndexPage() {
        if (!el.matchesGrid) return;

        const liveCount = matches.filter(m => m.status === 'live').length;
        if (el.liveMatchesCount) el.liveMatchesCount.textContent = liveCount;

        let filtered = matches.filter(match => {
            if (currentFilter === 'live' && match.status !== 'live') return false;
            if (currentFilter === 'today' && match.status !== 'today' && match.status !== 'live') return false;
            if (currentFilter === 'upcoming' && match.status !== 'upcoming') return false;
            if (currentFilter === 'finished' && match.status !== 'finished') return false;

            if (currentSearchQuery) {
                const query = currentSearchQuery.toLowerCase();
                const matchText = `${match.team1} ${match.team2} ${match.tournament} ${match.commentator} ${match.channel}`.toLowerCase();
                if (!matchText.includes(query)) return false;
            }
            return true;
        });

        const featuredMatch = matches.find(m => m.isFeatured) || matches.find(m => m.status === 'live') || matches[0];
        renderHeroBanner(featuredMatch);
        renderMatchesGrid(filtered);
    }

    function renderHeroBanner(match) {
        if (!el.heroFeaturedSection || !match) return;

        const scoreDisplay = formatMatchScore(match);
        const logo1HTML = getTeamLogoHTML(match.logo1, match.team1);
        const logo2HTML = getTeamLogoHTML(match.logo2, match.team2);
        const statusBadge = getStatusBadge(match.status);

        el.heroFeaturedSection.innerHTML = `
            <div class="hero-card">
                <div class="hero-top-badge">
                    <span class="featured-tag"><i class="fa-solid fa-star"></i> مباراة القمة 🔥</span>
                    <span class="tournament-badge">${escapeHTML(match.tournament)}</span>
                </div>
                <div class="hero-teams-wrapper">
                    <div class="hero-team">
                        <div class="team-logo-frame">
                            ${logo1HTML}
                        </div>
                        <span class="team-name">${escapeHTML(match.team1)}</span>
                    </div>

                    <div class="hero-vs-box">
                        ${statusBadge}
                        <div class="hero-score-badge">${escapeHTML(scoreDisplay)}</div>
                    </div>

                    <div class="hero-team">
                        <div class="team-logo-frame">
                            ${logo2HTML}
                        </div>
                        <span class="team-name">${escapeHTML(match.team2)}</span>
                    </div>
                </div>

                <div class="hero-meta-bar">
                    <div class="hero-info-item">
                        <i class="fa-regular fa-clock"></i>
                        <span>التوقيت: <strong>${escapeHTML(match.matchTime)}</strong></span>
                    </div>
                    <div class="hero-info-item">
                        <i class="fa-solid fa-tv"></i>
                        <span>القناة: <strong>${escapeHTML(match.channel)}</strong></span>
                    </div>
                    <div class="hero-info-item">
                        <i class="fa-solid fa-microphone"></i>
                        <span>المعلق: <strong>${escapeHTML(match.commentator)}</strong></span>
                    </div>
                    <a href="watch.html?id=${match.id}" class="btn-hero-watch">
                        <i class="fa-solid fa-circle-play"></i> مشاهدة البث المباشر
                    </a>
                </div>
            </div>
        `;
    }

    function renderMatchesGrid(list) {
        if (!el.matchesGrid) return;
        if (el.matchesCountLabel) el.matchesCountLabel.textContent = `عرض (${list.length}) مباراة`;

        if (list.length === 0) {
            el.matchesGrid.innerHTML = '';
            if (el.emptyState) el.emptyState.classList.remove('hidden');
            return;
        }

        if (el.emptyState) el.emptyState.classList.add('hidden');

        el.matchesGrid.innerHTML = list.map(match => {
            const logo1HTML = getTeamLogoHTML(match.logo1, match.team1);
            const logo2HTML = getTeamLogoHTML(match.logo2, match.team2);
            const scoreDisplay = formatMatchScore(match);
            const statusBadge = getStatusBadge(match.status);

            return `
                <div class="match-card">
                    <div class="match-card-header">
                        <span class="card-tournament"><i class="fa-solid fa-trophy gold-icon"></i> ${escapeHTML(match.tournament)}</span>
                        ${statusBadge}
                    </div>

                    <div class="match-card-body">
                        <div class="card-team">
                            <div class="card-team-logo">
                                ${logo1HTML}
                            </div>
                            <span class="card-team-name">${escapeHTML(match.team1)}</span>
                        </div>

                        <div class="card-score-box">
                            <div class="score-pill">${escapeHTML(scoreDisplay)}</div>
                            <span class="match-time-label">${escapeHTML(match.matchTime)}</span>
                        </div>

                        <div class="card-team">
                            <div class="card-team-logo">
                                ${logo2HTML}
                            </div>
                            <span class="card-team-name">${escapeHTML(match.team2)}</span>
                        </div>
                    </div>

                    <div class="match-card-footer">
                        <div class="footer-meta-item">
                            <i class="fa-solid fa-tv gold-icon"></i>
                            <span>${escapeHTML(match.channel)}</span>
                        </div>
                        <div class="footer-meta-item">
                            <i class="fa-solid fa-microphone gold-icon"></i>
                            <span>${escapeHTML(match.commentator)}</span>
                        </div>
                    </div>

                    <a href="watch.html?id=${match.id}" class="btn-card-watch">
                        <i class="fa-solid fa-play"></i> مشاهدة المباراة
                    </a>
                </div>
            `;
        }).join('');
    }

    function renderWatchPage() {
        if (!el.watchScoreboard) return;

        const liveCount = matches.filter(m => m.status === 'live').length;
        if (el.liveMatchesCount) el.liveMatchesCount.textContent = liveCount;

        const urlParams = new URLSearchParams(window.location.search);
        const matchId = urlParams.get('id');

        activeMatchForWatchPage = matches.find(m => m.id === matchId) || matches[0];

        if (!activeMatchForWatchPage) {
            alert('المباراة غير موجودة!');
            window.location.href = 'index.html';
            return;
        }

        document.title = `بث مباشر: ${activeMatchForWatchPage.team1} ضد ${activeMatchForWatchPage.team2} - عراق لايف`;

        const logo1HTML = getTeamLogoHTML(activeMatchForWatchPage.logo1, activeMatchForWatchPage.team1);
        const logo2HTML = getTeamLogoHTML(activeMatchForWatchPage.logo2, activeMatchForWatchPage.team2);
        const statusBadge = getStatusBadge(activeMatchForWatchPage.status);
        const scoreDisplay = formatMatchScore(activeMatchForWatchPage);

        el.watchScoreboard.innerHTML = `
            <div class="scoreboard-top">
                <span class="card-tournament"><i class="fa-solid fa-trophy gold-icon"></i> ${escapeHTML(activeMatchForWatchPage.tournament)}</span>
                ${statusBadge}
            </div>
            <div class="scoreboard-teams">
                <div class="card-team">
                    <div class="team-logo-frame">
                        ${logo1HTML}
                    </div>
                    <span class="scoreboard-team-name">${escapeHTML(activeMatchForWatchPage.team1)}</span>
                </div>

                <div class="scoreboard-vs-box">
                    <div class="scoreboard-score-pill">${escapeHTML(scoreDisplay)}</div>
                    <span class="match-time-label">${escapeHTML(activeMatchForWatchPage.matchTime)}</span>
                </div>

                <div class="card-team">
                    <div class="team-logo-frame">
                        ${logo2HTML}
                    </div>
                    <span class="scoreboard-team-name">${escapeHTML(activeMatchForWatchPage.team2)}</span>
                </div>
            </div>
        `;

        loadWatchServerStream(1);

        el.watchDetailsGrid.innerHTML = `
            <div class="detail-card">
                <div class="detail-icon"><i class="fa-solid fa-trophy"></i></div>
                <div class="detail-info">
                    <label>البطولة / الدوري</label>
                    <strong>${escapeHTML(activeMatchForWatchPage.tournament)}</strong>
                </div>
            </div>
            <div class="detail-card">
                <div class="detail-icon"><i class="fa-solid fa-tv"></i></div>
                <div class="detail-info">
                    <label>القناة الناقلة</label>
                    <strong>${escapeHTML(activeMatchForWatchPage.channel)}</strong>
                </div>
            </div>
            <div class="detail-card">
                <div class="detail-icon"><i class="fa-solid fa-microphone"></i></div>
                <div class="detail-info">
                    <label>المعلق الصوتي</label>
                    <strong>${escapeHTML(activeMatchForWatchPage.commentator)}</strong>
                </div>
            </div>
            <div class="detail-card">
                <div class="detail-icon"><i class="fa-regular fa-clock"></i></div>
                <div class="detail-info">
                    <label>الموعد / التوقيت</label>
                    <strong>${escapeHTML(activeMatchForWatchPage.matchTime)}</strong>
                </div>
            </div>
        `;

        const others = matches.filter(m => m.id !== activeMatchForWatchPage.id).slice(0, 3);
        if (el.otherMatchesGrid) {
            el.otherMatchesGrid.innerHTML = others.map(match => {
                const scorePill = formatMatchScore(match);
                return `
                    <div class="match-card">
                        <div class="match-card-header">
                            <span class="card-tournament">${escapeHTML(match.tournament)}</span>
                            ${getStatusBadge(match.status)}
                        </div>
                        <div class="match-card-body">
                            <div class="card-team"><span class="card-team-name">${escapeHTML(match.team1)}</span></div>
                            <div class="card-score-box"><div class="score-pill">${escapeHTML(scorePill)}</div></div>
                            <div class="card-team"><span class="card-team-name">${escapeHTML(match.team2)}</span></div>
                        </div>
                        <a href="watch.html?id=${match.id}" class="btn-card-watch">
                            <i class="fa-solid fa-play"></i> انتقال لهذه المباراة
                        </a>
                    </div>
                `;
            }).join('');
        }
    }

    function loadWatchServerStream(serverNum) {
        if (!activeMatchForWatchPage || !el.videoContainer) return;

        let link = serverNum === 2 ? activeMatchForWatchPage.streamLink2 : activeMatchForWatchPage.streamLink;
        if (!link || link.trim() === '') link = activeMatchForWatchPage.streamLink;

        if (!link || link.trim() === '') {
            el.videoContainer.innerHTML = `
                <div class="video-placeholder">
                    <i class="fa-solid fa-video-slash"></i>
                    <h3>لم يتم إضافة رابط البث المباشر لهذه المباراة بعد</h3>
                    <p>يمكن للأدمن إضافة رابط البث عبر لوحة التحكم بالرمز السري 0000</p>
                </div>
            `;
            return;
        }

        if (link.includes('<iframe')) {
            el.videoContainer.innerHTML = link;
        } else {
            let embedUrl = link;
            if (link.includes('youtube.com/watch?v=')) {
                const vidId = link.split('v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
            } else if (link.includes('youtu.be/')) {
                const vidId = link.split('youtu.be/')[1];
                embedUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
            }

            el.videoContainer.innerHTML = `
                <iframe src="${escapeHTML(embedUrl)}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            `;
        }
    }

    // -------------------------------------------------------------
    // Device Image Upload Handler
    // -------------------------------------------------------------
    function handleLogoFileUpload(fileInput, previewBox, targetTeamNum) {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Data = e.target.result;
            if (targetTeamNum === 1) {
                uploadedLogo1Base64 = base64Data;
            } else {
                uploadedLogo2Base64 = base64Data;
            }
            previewBox.innerHTML = `<img src="${base64Data}" alt="preview">`;
        };
        reader.readAsDataURL(file);
    }

    // -------------------------------------------------------------
    // Score Counters (+ / -)
    // -------------------------------------------------------------
    function changeScore(matchId, teamIndex, delta) {
        const target = matches.find(m => m.id === matchId);
        if (!target) return;

        if (teamIndex === 1) {
            target.score1 = Math.max(0, (target.score1 || 0) + delta);
        } else if (teamIndex === 2) {
            target.score2 = Math.max(0, (target.score2 || 0) + delta);
        }

        saveMatches();
        refreshCurrentPage();
        renderAdminTable();
    }

    // -------------------------------------------------------------
    // Secret Admin Triggers & Security
    // -------------------------------------------------------------
    function openAdminLogin() {
        el.adminPinInput.value = '';
        el.adminLoginError.classList.add('hidden');
        el.adminLoginModal.classList.remove('hidden');
        setTimeout(() => el.adminPinInput.focus(), 100);
    }

    function verifyAdminPasscode(e) {
        e.preventDefault();
        const enteredPin = el.adminPinInput.value.trim();

        if (enteredPin === ADMIN_PASSCODE) {
            el.adminLoginModal.classList.add('hidden');
            openAdminDrawer();
        } else {
            el.adminLoginError.classList.remove('hidden');
            el.adminPinInput.value = '';
            el.adminPinInput.focus();
        }
    }

    function openAdminDrawer() {
        renderAdminTable();
        el.adminPanel.classList.remove('hidden');
    }

    function closeAdminDrawer() {
        el.adminPanel.classList.add('hidden');
        resetMatchForm();
    }

    // Setup Secret Admin Triggers (Secret typing 0000, secret logo click, secret dot click)
    function setupSecretAdminTriggers() {
        // 1. Secret Typing Trigger: Typing '0000' anywhere on the page opens Admin Login
        document.addEventListener('keyup', (e) => {
            // Ignore typing inside input fields or textareas except secret buffer
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                return;
            }

            keyBuffer += e.key;
            if (keyBuffer.length > 6) {
                keyBuffer = keyBuffer.substring(keyBuffer.length - 6);
            }

            if (keyBuffer.endsWith('0000')) {
                keyBuffer = '';
                openAdminLogin();
            }
        });

        // 2. Secret Logo Icon Click
        if (el.secretLogoTrigger) {
            let clickCount = 0;
            let clickTimer = null;
            el.secretLogoTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                clickCount++;
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    if (clickCount >= 2) {
                        openAdminLogin();
                    }
                    clickCount = 0;
                }, 400);
            });
        }

        // 3. Secret Footer Dot Click
        if (el.secretFooterDot) {
            el.secretFooterDot.addEventListener('click', (e) => {
                e.preventDefault();
                openAdminLogin();
            });
        }
    }

    // -------------------------------------------------------------
    // Admin CRUD Operations
    // -------------------------------------------------------------
    function renderAdminTable() {
        if (!el.adminMatchesTableBody) return;

        if (matches.length === 0) {
            el.adminMatchesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding: 25px; color: var(--text-muted);">
                        لا توجد مباريات حالياً. أضف مباراة جديدة من النموذج أعلاه.
                    </td>
                </tr>
            `;
            return;
        }

        el.adminMatchesTableBody.innerHTML = matches.map(m => {
            const statusLabel = m.status === 'live' ? '🔴 مباشر' : (m.status === 'finished' ? '🏁 انتهت' : '⏳ قادماً');
            const score1Val = m.score1 ?? 0;
            const score2Val = m.score2 ?? 0;

            return `
                <tr>
                    <td>
                        <div class="table-team-cell">
                            <strong>${escapeHTML(m.team1)}</strong>
                            <span style="color:var(--gold-bright);">ضد</span>
                            <strong>${escapeHTML(m.team2)}</strong>
                        </div>
                        <div class="tbl-score-controls">
                            <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(m.team1)}:</span>
                            <div class="tbl-team-score-unit">
                                <button class="btn-tbl-score minus btn-score-change" data-id="${m.id}" data-team="1" data-delta="-1">-</button>
                                <span class="tbl-score-num">${score1Val}</span>
                                <button class="btn-tbl-score plus btn-score-change" data-id="${m.id}" data-team="1" data-delta="1">+</button>
                            </div>
                            <span style="color:var(--gold-primary); font-weight:800; margin:0 4px;">|</span>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(m.team2)}:</span>
                            <div class="tbl-team-score-unit">
                                <button class="btn-tbl-score minus btn-score-change" data-id="${m.id}" data-team="2" data-delta="-1">-</button>
                                <span class="tbl-score-num">${score2Val}</span>
                                <button class="btn-tbl-score plus btn-score-change" data-id="${m.id}" data-team="2" data-delta="1">+</button>
                            </div>
                        </div>
                    </td>
                    <td>${escapeHTML(m.tournament)}</td>
                    <td><span class="match-status-tag ${m.status}">${statusLabel}</span></td>
                    <td>${escapeHTML(m.matchTime)}</td>
                    <td>${escapeHTML(m.channel)} - (${escapeHTML(m.commentator)})</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-tbl-edit" data-id="${m.id}"><i class="fa-solid fa-pen"></i> تعديل</button>
                            <button class="btn-tbl-delete" data-id="${m.id}"><i class="fa-solid fa-trash"></i> حذف</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        el.adminMatchesTableBody.querySelectorAll('.btn-score-change').forEach(btn => {
            btn.addEventListener('click', () => {
                const matchId = btn.getAttribute('data-id');
                const teamNum = parseInt(btn.getAttribute('data-team'), 10);
                const delta = parseInt(btn.getAttribute('data-delta'), 10);
                changeScore(matchId, teamNum, delta);
            });
        });

        el.adminMatchesTableBody.querySelectorAll('.btn-tbl-edit').forEach(btn => {
            btn.addEventListener('click', () => editMatch(btn.getAttribute('data-id')));
        });

        el.adminMatchesTableBody.querySelectorAll('.btn-tbl-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteMatch(btn.getAttribute('data-id')));
        });
    }

    function handleMatchFormSubmit(e) {
        e.preventDefault();

        const matchId = el.matchIdInput.value;
        const isEditing = Boolean(matchId);

        const newMatchData = {
            id: isEditing ? matchId : 'match-' + Date.now(),
            tournament: el.tournamentInput.value.trim(),
            team1: el.team1Input.value.trim(),
            logo1: uploadedLogo1Base64,
            team2: el.team2Input.value.trim(),
            logo2: uploadedLogo2Base64,
            status: el.statusInput.value,
            score1: parseInt(el.score1Input.value, 10) || 0,
            score2: parseInt(el.score2Input.value, 10) || 0,
            matchTime: el.matchTimeInput.value.trim(),
            channel: el.channelInput.value.trim(),
            commentator: el.commentatorInput.value.trim(),
            streamLink: el.streamLinkInput.value.trim(),
            streamLink2: el.streamLink2Input.value.trim(),
            isFeatured: el.isFeaturedInput.checked
        };

        if (newMatchData.isFeatured) {
            matches.forEach(m => m.isFeatured = false);
        }

        if (isEditing) {
            const index = matches.findIndex(m => m.id === matchId);
            if (index !== -1) matches[index] = newMatchData;
        } else {
            matches.unshift(newMatchData);
        }

        saveMatches();
        refreshCurrentPage();
        renderAdminTable();
        resetMatchForm();

        alert(isEditing ? 'تم تحديث بيانات المباراة بنجاح!' : 'تم إضافة المباراة الجديدة بنجاح!');
    }

    function editMatch(id) {
        const target = matches.find(m => m.id === id);
        if (!target) return;

        el.matchIdInput.value = target.id;
        el.tournamentInput.value = target.tournament;
        el.team1Input.value = target.team1;
        el.team2Input.value = target.team2;
        
        uploadedLogo1Base64 = target.logo1 || '';
        uploadedLogo2Base64 = target.logo2 || '';

        el.logo1Preview.innerHTML = uploadedLogo1Base64 ? `<img src="${uploadedLogo1Base64}">` : '<span>لا توجد صورة</span>';
        el.logo2Preview.innerHTML = uploadedLogo2Base64 ? `<img src="${uploadedLogo2Base64}">` : '<span>لا توجد صورة</span>';

        el.statusInput.value = target.status;
        el.score1Input.value = target.score1 ?? 0;
        el.score2Input.value = target.score2 ?? 0;
        el.matchTimeInput.value = target.matchTime;
        el.channelInput.value = target.channel;
        el.commentatorInput.value = target.commentator;
        el.streamLinkInput.value = target.streamLink || '';
        el.streamLink2Input.value = target.streamLink2 || '';
        el.isFeaturedInput.checked = Boolean(target.isFeatured);

        if (el.formTeam1Name) el.formTeam1Name.textContent = target.team1 || 'الفريق الأول';
        if (el.formTeam2Name) el.formTeam2Name.textContent = target.team2 || 'الفريق الثاني';

        el.formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square gold-icon"></i> تعديل بيانات المباراة`;
        el.saveMatchBtn.innerHTML = `<i class="fa-solid fa-check"></i> تحديث المباراة`;
        el.cancelEditBtn.classList.remove('hidden');

        el.adminPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetMatchForm() {
        if (!el.matchForm) return;
        el.matchForm.reset();
        el.matchIdInput.value = '';
        uploadedLogo1Base64 = '';
        uploadedLogo2Base64 = '';
        if (el.logo1Preview) el.logo1Preview.innerHTML = '<span>لا توجد صورة</span>';
        if (el.logo2Preview) el.logo2Preview.innerHTML = '<span>لا توجد صورة</span>';
        if (el.score1Input) el.score1Input.value = '0';
        if (el.score2Input) el.score2Input.value = '0';
        if (el.formTeam1Name) el.formTeam1Name.textContent = 'الفريق الأول';
        if (el.formTeam2Name) el.formTeam2Name.textContent = 'الفريق الثاني';
        if (el.formTitle) el.formTitle.innerHTML = `<i class="fa-solid fa-plus-circle gold-icon"></i> إضافة مباراة جديدة`;
        if (el.saveMatchBtn) el.saveMatchBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> حفظ المباراة`;
        if (el.cancelEditBtn) el.cancelEditBtn.classList.add('hidden');
    }

    function deleteMatch(id) {
        const target = matches.find(m => m.id === id);
        if (!target) return;

        if (confirm(`هل أنت محقق من رغبتك في حذف مباراة (${target.team1} ضد ${target.team2})؟`)) {
            matches = matches.filter(m => m.id !== id);
            saveMatches();
            refreshCurrentPage();
            renderAdminTable();
        }
    }

    // -------------------------------------------------------------
    // Setup Event Listeners
    // -------------------------------------------------------------
    function setupEventListeners() {
        // Local Logo File Uploads
        if (el.logoFile1Input) {
            el.logoFile1Input.addEventListener('change', () => handleLogoFileUpload(el.logoFile1Input, el.logo1Preview, 1));
        }
        if (el.logoFile2Input) {
            el.logoFile2Input.addEventListener('change', () => handleLogoFileUpload(el.logoFile2Input, el.logo2Preview, 2));
        }

        // Live Team Titles on Form
        if (el.team1Input) {
            el.team1Input.addEventListener('input', (e) => {
                if (el.formTeam1Name) el.formTeam1Name.textContent = e.target.value.trim() || 'الفريق الأول';
            });
        }
        if (el.team2Input) {
            el.team2Input.addEventListener('input', (e) => {
                if (el.formTeam2Name) el.formTeam2Name.textContent = e.target.value.trim() || 'الفريق الثاني';
            });
        }

        // Form Score Counters
        if (el.formScore1Minus) {
            el.formScore1Minus.addEventListener('click', () => {
                let current = parseInt(el.score1Input.value, 10) || 0;
                el.score1Input.value = Math.max(0, current - 1);
            });
        }
        if (el.formScore1Plus) {
            el.formScore1Plus.addEventListener('click', () => {
                let current = parseInt(el.score1Input.value, 10) || 0;
                el.score1Input.value = current + 1;
            });
        }
        if (el.formScore2Minus) {
            el.formScore2Minus.addEventListener('click', () => {
                let current = parseInt(el.score2Input.value, 10) || 0;
                el.score2Input.value = Math.max(0, current - 1);
            });
        }
        if (el.formScore2Plus) {
            el.formScore2Plus.addEventListener('click', () => {
                let current = parseInt(el.score2Input.value, 10) || 0;
                el.score2Input.value = current + 1;
            });
        }

        // Filters & Search
        if (el.filterTabs) {
            el.filterTabs.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-btn');
                if (!btn) return;

                el.filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderIndexPage();
            });
        }

        if (el.searchInput) {
            el.searchInput.addEventListener('input', (e) => {
                currentSearchQuery = e.target.value.trim();
                renderIndexPage();
            });
        }

        if (el.serverButtons) {
            el.serverButtons.addEventListener('click', (e) => {
                const btn = e.target.closest('.server-btn');
                if (!btn) return;

                const serverNum = parseInt(btn.getAttribute('data-server'), 10);
                el.serverButtons.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadWatchServerStream(serverNum);
            });
        }

        // Admin Passcode Check
        if (el.closeAdminLoginModal) el.closeAdminLoginModal.addEventListener('click', () => el.adminLoginModal.classList.add('hidden'));
        if (el.adminLoginForm) el.adminLoginForm.addEventListener('submit', verifyAdminPasscode);

        // Secret Triggers Setup
        setupSecretAdminTriggers();

        // Admin Actions
        if (el.closeAdminPanelBtn) el.closeAdminPanelBtn.addEventListener('click', closeAdminDrawer);
        if (el.resetDataBtn) el.resetDataBtn.addEventListener('click', resetToDefaultMatches);
        if (el.matchForm) el.matchForm.addEventListener('submit', handleMatchFormSubmit);
        if (el.cancelEditBtn) el.cancelEditBtn.addEventListener('click', resetMatchForm);
    }

    function init() {
        loadMatches();
        setupEventListeners();

        if (isWatchPage) {
            renderWatchPage();
        } else {
            renderIndexPage();
        }
    }

    document.addEventListener('DOMContentLoaded', init);

})();

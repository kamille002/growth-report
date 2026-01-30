// 핵심 설정과 탭 이동만 남긴 app.js
const SUPABASE_URL = 'https://pkryjtjsaajalqqzzoyk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcnlqdGpzYWFqYWxxcXp6b3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDgwMjYsImV4cCI6MjA4NTE4NDAyNn0.v8_aUSCd_D0Zqtiq5bGSrkhMRHCQI2e-Lyq1i6Mpqjs'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function switchTab(tabId) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');
    // 홈으로 갈 때 log.js에 있는 함수를 호출합니다
    if(tabId === 'home') loadHistory(); 
}

window.onload = () => {
    loadHistory(); // 앱 켜질 때 기록 불러오기
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 2500);
};

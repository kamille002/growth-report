// 앱의 모든 기능을 총괄하는 두뇌 파일입니다.
const SUPABASE_URL = 'https://pkryjtjsaajalqqzzoyk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcnlqdGpzYWFqYWxxcXp6b3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDgwMjYsImV4cCI6MjA4NTE4NDAyNn0.v8_aUSCd_D0Zqtiq5bGSrkhMRHCQI2e-Lyq1i6Mpqjs'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. 탭 전환 기능 (어떤 방으로 갈지 결정)
function switchTab(tabId) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if(tabId === 'home') loadData(); // 홈으로 오면 데이터 새로고침
}

// 2. 초기 구동 (스플래시 제거 및 데이터 로드)
window.onload = () => {
    loadData();
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 800);
        }
    }, 2500);
};

// 3. 데이터 로딩 및 리스트 생성
async function loadData() {
    const { data } = await _supabase.from('growth_logs').select('*').order('created_at', { ascending: true });
    if (data) {
        const listDiv = document.getElementById('history-list');
        listDiv.innerHTML = [...data].reverse().map(item => `
            <div class="history-item">
                <div class="history-img">👶</div>
                <div style="flex: 1;">
                    <div style="font-size: 11px; color:#AAA;">${new Date(item.created_at).toLocaleDateString()}</div>
                    <div style="font-weight:700;">${item.height}cm / ${item.weight}kg</div>
                </div>
                <div onclick="deleteLog('${item.id}')" style="color:#FF6B6B; font-size:12px; cursor:pointer;">삭제</div>
            </div>
        `).join('');
        renderChart(data);
    }
}

// 4. 차트 그리기
let myChart;
function renderChart(data) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.created_at).toLocaleDateString()),
            datasets: [{ 
                label: '키(cm)', 
                data: data.map(d => d.height), 
                borderColor: '#FF6B6B', 
                backgroundColor: 'rgba(255,107,107,0.1)', 
                fill: true, 
                tension: 0.4 
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
    });
}

// 5. 기록 추가 팝업
window.showAddLog = () => {
    const today = new Date().toISOString().split('T')[0];
    Swal.fire({
        title: '성장 기록',
        html: `<input type="date" id="logDate" class="swal2-input" value="${today}">
               <input type="number" id="height" class="swal2-input" placeholder="키(cm)">
               <input type="number" id="weight" class="swal2-input" placeholder="몸무게(kg)">`,
        confirmButtonText: '저장',
        showCancelButton: true,
        preConfirm: () => {
            return { date: document.getElementById('logDate').value, height: document.getElementById('height').value, weight: document.getElementById('weight').value }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { date, height, weight } = result.value;
            await _supabase.from('growth_logs').insert([{ height: parseFloat(height), weight: parseFloat(weight), photo_url: 'EMPTY', created_at: new Date(date).toISOString() }]);
            loadData();
        }
    });
};

// 6. 삭제 기능
async function deleteLog(id) {
    if (confirm("정말 삭제할까요?")) {
        await _supabase.from('growth_logs').delete().eq('id', id);
        loadData();
    }
}

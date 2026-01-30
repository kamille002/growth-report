// 메인 컨트롤러: 탭 이동 및 전역 함수 관리
const SUPABASE_URL = 'https://pkryjtjsaajalqqzzoyk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcnlqdGpzYWFqYWxxcXp6b3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDgwMjYsImV4cCI6MjA4NTE4NDAyNn0.v8_aUSCd_D0Zqtiq5bGSrkhMRHCQI2e-Lyq1i6Mpqjs'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. 탭 전환 기능
function switchTab(tabId) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    
    // 클릭된 요소에 active 클래스 추가
    if (event) {
        event.currentTarget.classList.add('active');
    }

    if(tabId === 'home') loadHistory(); 
}

// 2. 초기 구동
window.onload = () => {
    // 뒤에서 조용히 데이터를 로드합니다.
    if (typeof loadHistory === 'function') loadHistory();

    // 스플래시 화면을 2.5초 동안 보여준 뒤 부드럽게 치웁니다.
    setTimeout(() => {
        const splash = document.getElementById('splash-screen'); // 이름 수정됨
        if (splash) {
            splash.style.transition = 'opacity 0.8s ease';
            splash.style.opacity = '0';
            
            // 0.8초 동안 서서히 사라지는 효과 후 완전히 제거
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    }, 2500);
};

// 3. 오늘의 성장 기록 버튼 활성화 (window에 명시적으로 등록)
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
            return { 
                date: document.getElementById('logDate').value, 
                height: document.getElementById('height').value, 
                weight: document.getElementById('weight').value 
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { date, height, weight } = result.value;
            await _supabase.from('growth_logs').insert([{ 
                height: parseFloat(height), 
                weight: parseFloat(weight), 
                photo_url: 'EMPTY', 
                created_at: new Date(date).toISOString() 
            }]);
            if (typeof loadHistory === 'function') loadHistory();
        }
    });
};

// 4. 삭제 버튼 활성화 (window에 명시적으로 등록)
window.deleteLog = async (id) => {
    const result = await Swal.fire({
        title: '정말 삭제할까요?',
        text: "삭제된 기록은 되돌릴 수 없습니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF6B6B',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
        await _supabase.from('growth_logs').delete().eq('id', id);
        if (typeof loadHistory === 'function') loadHistory();
    }
};

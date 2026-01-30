// 사진이 없으면 👶 아이콘을 보여주는 스마트 로직입니다.
async function loadHistory() {
    const { data } = await _supabase.from('growth_logs').select('*').order('created_at', { ascending: false });
    const listDiv = document.getElementById('history-list');
    
    if (data && listDiv) {
        listDiv.innerHTML = data.map(item => {
            // 사진이 깨지거나 없으면 아기 아이콘으로 대체!
            const photoContent = (item.photo_url && item.photo_url !== 'EMPTY' && item.photo_url !== 'NULL') 
                ? `<img src="${item.photo_url}" class="history-img">`
                : `<div class="history-img">👶</div>`;

            return `
                <div class="history-item">
                    ${photoContent}
                    <div style="flex: 1;">
                        <div style="font-size: 11px; color:#AAA;">${new Date(item.created_at).toLocaleDateString()}</div>
                        <div style="font-weight:700;">${item.height}cm / ${item.weight}kg</div>
                    </div>
                    <div onclick="deleteLog('${item.id}')" style="color:#FF6B6B; font-size:12px; cursor:pointer;">삭제</div>
                </div>
            `;
        }).join('');
    }
}

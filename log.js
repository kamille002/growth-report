async function saveLog(type) {
  // 현재 RLS가 Disabled 상태이므로 복잡한 인증 없이 바로 insert 시도
  const { data, error } = await supabase
    .from('growth_logs')
    .insert([{ type: type, created_at: new Date() }]);

  if (error) {
    console.error('Error saving log:', error);
    alert('저장 실패!');
  } else {
    alert(type + ' 기록 완료!');
  }
}

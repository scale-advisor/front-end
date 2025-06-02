import * as XLSX from 'xlsx';

/**
 * 요구사항 데이터를 엑셀 형식으로 변환
 * @param {Array} requirements - 요구사항 데이터 배열
 * @returns {Object} headers와 rows를 포함한 객체
 */
export const generateExcelData = (requirements) => {
  // 엑셀 헤더 정의
  const headers = [
    { label: '요구사항 번호', key: 'requirementNumber', width: 15 },
    { label: '요구사항 명', key: 'requirementName', width: 30 },
    { label: '요구사항 유형', key: 'requirementType', width: 15 },
    { label: '요구사항 정의', key: 'requirementDefinition', width: 30 },
    { label: '상세 설명', key: 'requirementDetail', width: 50 },
  ];

  // 데이터 행 생성
  const rows = requirements.map((req) => {
    return {
      '요구사항 번호': req.requirementNumber || '',
      '요구사항 명': req.requirementName || '',
      '요구사항 유형': req.requirementType || '',
      '요구사항 정의': req.requirementDefinition || '',
      '상세 설명': req.requirementDetail?.replace(/\n/g, ' ') || '', // 줄바꿈을 공백으로 변환
    };
  });

  return { headers, rows };
};

/**
 * 요구사항 데이터를 엑셀 파일로 다운로드
 * @param {Array} requirements - 요구사항 데이터 배열
 * @returns {Promise<void>}
 * @throws {Error} 엑셀 생성 중 오류 발생 시
 */
export const downloadRequirementsExcel = (requirements) => {
  if (!requirements || requirements.length === 0) {
    throw new Error('다운로드할 요구사항 데이터가 없습니다.');
  }

  // 엑셀 데이터 생성
  const { headers, rows } = generateExcelData(requirements);

  // 워크북 생성
  const workbook = XLSX.utils.book_new();

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: headers.map((h) => h.label),
  });

  // 열 너비 설정
  const colWidths = {};
  headers.forEach((h, i) => {
    const col = XLSX.utils.encode_col(i);
    colWidths[col] = { wch: h.width };
  });
  worksheet['!cols'] = Object.values(colWidths);

  // 워크북에 워크시트 추가
  XLSX.utils.book_append_sheet(workbook, worksheet, '요구사항 목록');

  // 파일 다운로드
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  XLSX.writeFile(workbook, `요구사항_분석결과_${timestamp}.xlsx`);
};

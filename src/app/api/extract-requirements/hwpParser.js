const { DOMParser } = require('xmldom');

// XML에서 테이블 요소를 찾는 함수
function findTables(xmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  return doc.getElementsByTagName('hp:tbl');
}

// 문자열에서 모든 공백 제거
function removeAllSpaces(str) {
  return str.replace(/\s+/g, '');
}

// 라벨 매칭 함수
function matchLabel(text, keywords) {
  const normalizedText = removeAllSpaces(text.toLowerCase());
  return keywords.some((keyword) =>
    normalizedText.includes(removeAllSpaces(keyword.toLowerCase())),
  );
}

// 테이블이 요구사항 테이블인지 확인하는 함수
function isRequirementTable(table) {
  const cells = table.getElementsByTagName('hp:tc');
  const requirementKeywords = [
    '요구사항 고유번호',
    '요구사항번호',
    '고유번호',
    '번호',
    '요구사항 분류',
    '요구사항구분',
    '구분',
    '분류',
    '요구사항 명칭',
    '요구사항이름',
    '요구사항 이름',
    '명칭',
    '이름',
  ];

  for (let i = 0; i < cells.length; i++) {
    const cellText = getCellText(cells[i]);
    if (matchLabel(cellText, requirementKeywords)) {
      return true;
    }
  }
  return false;
}

// 셀의 모든 문단의 텍스트 내용을 가져오는 함수
function getCellText(cell) {
  const paragraphs = cell.getElementsByTagName('hp:p');
  let text = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const textElements = paragraphs[i].getElementsByTagName('hp:t');
    let paragraphText = '';
    for (let j = 0; j < textElements.length; j++) {
      paragraphText += textElements[j].textContent;
    }
    if (paragraphText.trim()) {
      text.push(paragraphText.trim());
    }
  }

  return text.join('\n');
}

// 요구사항 테이블에서 정보를 추출하는 함수
function extractTableInfo(table) {
  const requirement = {
    requirementNumber: '',
    requirementName: '',
    requirementType: '',
    requirementDefinition: '',
    requirementDetail: '',
  };

  const rows = table.getElementsByTagName('hp:tr');
  let isDetailSection = false;

  // 라벨 키워드 정의
  const numberKeywords = [
    '요구사항 고유번호',
    '요구사항번호',
    '요구사항 번호',
    '고유번호',
    '고유 번호',
    '번호',
    'ID',
    'REQ-ID',
  ];
  const typeKeywords = [
    '요구사항 분류',
    '요구사항구분',
    '요구사항 구분',
    '요구사항 유형',
    '요구사항유형',
    '구분',
    '분류',
    '유형',
    '종류',
    '요구사항 종류',
    'Type',
    'Category',
  ];
  const nameKeywords = [
    '요구사항 명칭',
    '요구사항이름',
    '요구사항 이름',
    '요구사항 제목',
    '요구사항제목',
    '요구사항 명',
    '명칭',
    '이름',
    '제목',
    '항목',
    '요구사항 항목',
    '기능 명',
    '기능명',
    'Name',
    'Title',
  ];
  const detailKeywords = [
    '요구사항 상세',
    '요구사항상세',
    '상세설명',
    '상세 설명',
    '요구사항 설명',
    '요구사항설명',
    '설명',
    '상세내용',
    '상세 내용',
    '요구사항 내용',
    '요구사항내용',
  ];
  const subDetailKeywords = [
    '세부',
    '내용',
    '세부내용',
    '세부 내용',
    '상세기능',
    '상세 기능',
    '기능 설명',
    '기능설명',
    '구현 내용',
    '구현내용',
    '세부 요구사항',
    '세부요구사항',
    '세부사항',
    '세부 사항',
  ];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('hp:tc');
    const firstCellText = getCellText(cells[0]);

    // 상세설명 이전의 행들 (2열 구조)
    if (!isDetailSection) {
      if (cells.length === 2) {
        if (matchLabel(firstCellText, numberKeywords)) {
          requirement.requirementNumber = getCellText(cells[1]);
        } else if (matchLabel(firstCellText, typeKeywords)) {
          requirement.requirementType = getCellText(cells[1]);
        } else if (matchLabel(firstCellText, nameKeywords)) {
          requirement.requirementName = getCellText(cells[1]);
        }
      }
    }

    // 요구사항 상세설명 섹션 시작 확인
    if (matchLabel(firstCellText, detailKeywords)) {
      isDetailSection = true;
      if (cells.length === 3) {
        requirement.requirementDefinition = getCellText(cells[2]);
      }

      // 다음 행에서 세부내용 찾기
      if (i + 1 < rows.length) {
        const nextRow = rows[i + 1];
        const nextCells = nextRow.getElementsByTagName('hp:tc');

        // 병합된 셀 구조를 고려하여 세부내용 셀 찾기
        for (let j = 0; j < nextCells.length; j++) {
          const cellText = getCellText(nextCells[j]);
          if (matchLabel(cellText, subDetailKeywords)) {
            // 세부내용은 항상 다음 셀에 있음
            if (j + 1 < nextCells.length) {
              requirement.requirementDetail = getCellText(nextCells[j + 1]);
            }
            break;
          }
        }
      }
      continue;
    }
  }

  return requirement;
}

// 메인 파싱 함수
function parseRequirements(xmlContent) {
  const tables = findTables(xmlContent);
  const requirements = [];

  for (let i = 0; i < tables.length; i++) {
    if (isRequirementTable(tables[i])) {
      const requirementInfo = extractTableInfo(tables[i]);

      // 모든 필드가 비어있지 않은 경우에만 추가
      if (
        requirementInfo.requirementNumber &&
        requirementInfo.requirementName &&
        requirementInfo.requirementDefinition &&
        requirementInfo.requirementDetail &&
        requirementInfo.requirementType
      ) {
        requirements.push(requirementInfo);
      }
    }
  }

  return requirements;
}

module.exports = {
  parseRequirements,
};

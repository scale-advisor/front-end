// COCOMO I 모델 상수
export const COCOMO_CONSTANTS = {
  ORGANIC: {
    a: 2.4,
    b: 1.05,
  },
  SEMI_DETACHED: {
    a: 3.0,
    b: 1.12,
  },
  EMBEDDED: {
    a: 3.6,
    b: 1.2,
  },
};

// COCOMO I 개발 기간 상수
export const TDEV_CONSTANTS = {
  c: 2.5, // 상수
  d: 0.38, // 지수
};

// COCOMO II Scale Factors 설명
export const SCALE_FACTOR_DESCRIPTIONS = {
  PREC: '개발 전의 조직적 준비 정도',
  FLEX: '개발 프로세스의 유연성',
  RESL: '아키텍처와 리스크 해결 수준',
  TEAM: '팀 응집력',
  PMAT: '프로세스 성숙도',
};

// COCOMO II Cost Drivers 설명
export const COST_DRIVER_DESCRIPTIONS = {
  RCPX: '제품의 복잡도',
  RUSE: '재사용 요구 수준',
  PDIF: '플랫폼의 어려움',
  PERS: '개발자 능력',
  PREX: '프로젝트 경험',
  FCIL: '개발 환경',
  SCED: '일정 압박 정도',
};

// Rating Options
export const RATING_OPTIONS = [
  'Very Low',
  'Low',
  'Nominal',
  'High',
  'Very High',
  'Extra High',
];

// COCOMO II 노력 승수 (Effort Multipliers)
export const EFFORT_MULTIPLIERS = {
  // 제품 신뢰성 및 복잡도
  RCPX: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 요구되는 재사용성
  RUSE: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 플랫폼 난이도
  PDIF: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 인력 경험
  PREX: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 인력 역량
  PERS: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 요구되는 일정
  SCED: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
  // 팀 지원 시설
  FCIL: {
    'Very Low': 1,
    Low: 2,
    Nominal: 3,
    High: 4,
    'Very High': 5,
    'Extra High': 6,
  },
};

// COCOMO II 규모 인자 (Scale Factors)
export const SCALE_FACTORS = {
  // 유사 경험
  PREC: {
    'Very Low': 0,
    Low: 1,
    Nominal: 3,
    High: 5,
    'Very High': 6,
  },
  // 유연성
  FLEX: {
    'Very Low': 0,
    Low: 1,
    Nominal: 3,
    High: 5,
    'Very High': 6,
  },
  // 리스크 관리
  RESL: {
    'Very Low': 0,
    Low: 1,
    Nominal: 3,
    High: 5,
    'Very High': 6,
  },
  // 팀 협력
  TEAM: {
    'Very Low': 0,
    Low: 1,
    Nominal: 3,
    High: 5,
    'Very High': 6,
  },
  // 프로세스 성숙도
  PMAT: {
    'Very Low': 0,
    Low: 1,
    Nominal: 3,
    High: 5,
    'Very High': 6,
  },
};

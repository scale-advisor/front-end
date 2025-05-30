import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { parseRequirements } from './hwpParser';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5분
export const runtime = 'nodejs';

// 파일 크기 제한 설정
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// 파일 크기 제한 설정 추가
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: '파일이 업로드되지 않았습니다.' },
        { status: 400 },
      );
    }

    // 파일 확장자 확인
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.hwpx')) {
      return NextResponse.json(
        { error: 'HWPX 파일만 업로드 가능합니다.' },
        { status: 400 },
      );
    }

    try {
      // 임시 파일 경로 생성
      const tempDir = os.tmpdir();
      const tempFilePath = join(tempDir, `temp_${Date.now()}.hwpx`);

      // 파일을 임시 디렉토리에 저장
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(tempFilePath, buffer);

      // ZIP 파일 열기
      const zip = new AdmZip(tempFilePath);
      const zipEntries = zip.getEntries();

      // section이 포함된 XML 파일 찾기
      const sectionFiles = zipEntries.filter(
        (entry) =>
          entry.entryName.toLowerCase().includes('section') &&
          entry.entryName.toLowerCase().endsWith('.xml'),
      );

      console.log(
        '찾은 섹션 파일들:',
        sectionFiles.map((f) => f.entryName),
      );

      if (sectionFiles.length === 0) {
        return NextResponse.json(
          { error: 'section XML을 찾을 수 없습니다.' },
          { status: 400 },
        );
      }

      let allRequirements = [];

      // 여러 section 파일을 순회
      for (const sectionFile of sectionFiles) {
        console.log(`\n[${sectionFile.entryName}] 파일 처리 시작`);

        const content = sectionFile.getData().toString('utf8');
        console.log('파일 내용 일부:', content.substring(0, 200) + '...');

        // 요구사항 추출
        const sectionRequirements = parseRequirements(content);
        console.log(
          `[${sectionFile.entryName}] 추출된 요구사항 수:`,
          sectionRequirements?.length || 0,
        );

        if (sectionRequirements && sectionRequirements.length > 0) {
          console.log('첫 번째 추출된 요구사항:', sectionRequirements[0]);
          allRequirements = [...allRequirements, ...sectionRequirements];
        }
      }

      console.log('\n최종 추출된 전체 요구사항 수:', allRequirements.length);
      if (allRequirements.length > 0) {
        console.log('최종 요구사항 샘플:', allRequirements[0]);
      }

      if (allRequirements.length === 0) {
        return NextResponse.json(
          { error: '요구사항을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { requirements: allRequirements },
        { status: 200 },
      );
    } catch (zipError) {
      console.error('ZIP 파일 처리 중 오류:', zipError);
      return NextResponse.json(
        {
          error: '올바른 HWPX 파일이 아니거나 파일이 손상되었습니다.',
          details: zipError.message,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('요구사항 추출 중 오류 발생:', error);
    return NextResponse.json(
      { error: '요구사항 추출 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

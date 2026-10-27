/**
 * 단위 변환 유틸리티
 * 다양한 단위 간 변환을 수행하는 함수들을 제공합니다.
 */

export interface UnitDefinition {
  ratio: number;
  symbol: string;
}

export interface TemperatureUnitDefinition {
  symbol: string;
}

// 길이 단위 정의
export const lengthUnits: Record<string, UnitDefinition> = {
  미터: { ratio: 1, symbol: "m" },
  킬로미터: { ratio: 0.001, symbol: "km" },
  센티미터: { ratio: 100, symbol: "cm" },
  밀리미터: { ratio: 1000, symbol: "mm" },
  마일: { ratio: 0.000621371, symbol: "mi" },
  야드: { ratio: 1.09361, symbol: "yd" },
  피트: { ratio: 3.28084, symbol: "ft" },
  인치: { ratio: 39.3701, symbol: "in" },
};

// 무게 단위 정의
export const weightUnits: Record<string, UnitDefinition> = {
  킬로그램: { ratio: 1, symbol: "kg" },
  그램: { ratio: 1000, symbol: "g" },
  밀리그램: { ratio: 1000000, symbol: "mg" },
  톤: { ratio: 0.001, symbol: "t" },
  파운드: { ratio: 2.20462, symbol: "lb" },
  온스: { ratio: 35.274, symbol: "oz" },
};

// 부피 단위 정의
export const volumeUnits: Record<string, UnitDefinition> = {
  리터: { ratio: 1, symbol: "L" },
  밀리리터: { ratio: 1000, symbol: "mL" },
  세제곱미터: { ratio: 0.001, symbol: "m³" },
  갤런: { ratio: 0.264172, symbol: "gal" },
  쿼트: { ratio: 1.05669, symbol: "qt" },
  파인트: { ratio: 2.11338, symbol: "pt" },
  컵: { ratio: 4.22675, symbol: "cup" },
};

// 온도 단위 정의
export const temperatureUnits: Record<string, TemperatureUnitDefinition> = {
  섭씨: { symbol: "°C" },
  화씨: { symbol: "°F" },
  켈빈: { symbol: "K" },
};

/**
 * 온도 변환 함수
 * @param value - 변환할 값
 * @param from - 원본 단위
 * @param to - 목표 단위
 * @returns 변환된 값
 */
export const convertTemperature = (
  value: number,
  from: string,
  to: string
): number => {
  if (from === to) return value;

  // 먼저 섭씨로 변환
  let celsius = value;
  if (from === "화씨") {
    celsius = ((value - 32) * 5) / 9;
  } else if (from === "켈빈") {
    celsius = value - 273.15;
  }

  // 섭씨에서 목표 단위로 변환
  if (to === "섭씨") return celsius;
  if (to === "화씨") return (celsius * 9) / 5 + 32;
  if (to === "켈빈") return celsius + 273.15;

  return value;
};

/**
 * 일반 단위 변환 함수
 * @param value - 변환할 값
 * @param from - 원본 단위
 * @param to - 목표 단위
 * @param units - 단위 정의 객체
 * @returns 변환된 값
 */
export const convertUnit = (
  value: number,
  from: string,
  to: string,
  units: Record<string, UnitDefinition>
): number => {
  if (from === to) return value;

  const fromUnit = units[from];
  const toUnit = units[to];

  if (!fromUnit || !toUnit) {
    throw new Error(`알 수 없는 단위: ${!fromUnit ? from : to}`);
  }

  const baseValue = value / fromUnit.ratio;
  return baseValue * toUnit.ratio;
};

/**
 * 숫자 포맷 함수 - 불필요한 소수점 제거
 * @param value - 포맷할 숫자
 * @param maxDecimals - 최대 소수점 자리수 (기본값: 10)
 * @returns 포맷된 문자열
 */
export const formatNumber = (value: number, maxDecimals: number = 10): string => {
  if (!Number.isFinite(value)) throw new Error("변환 결과가 숫자 범위를 벗어났습니다");

  // 매우 작은 값이나 큰 값은 지수 표기법 사용
  if (value === 0) return "0";
  if (Math.abs(value) < 1e-10) return value.toExponential(6);
  if (Math.abs(value) >= 1e10) return value.toExponential(6);

  // 일반적인 경우 불필요한 0 제거
  return value.toFixed(maxDecimals).replace(/\.?0+$/, "");
};

/**
 * 입력 값 검증 함수
 * @param value - 검증할 값
 * @returns 검증 결과
 */
export const validateInput = (value: string): {
  isValid: boolean;
  error?: string;
} => {
  if (value.trim() === "") {
    return { isValid: true };
  }

  const trimmed = value.trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(trimmed)) {
    return { isValid: false, error: "유효한 숫자를 입력해주세요" };
  }
  const numValue = Number(trimmed);

  if (isNaN(numValue)) {
    return { isValid: false, error: "유효한 숫자를 입력해주세요" };
  }

  if (!isFinite(numValue)) {
    return { isValid: false, error: "유효한 범위의 숫자를 입력해주세요" };
  }

  return { isValid: true };
};

/** 입력과 단위 변경에서 같은 결과·오류 상태를 반환합니다. */
export function convertInput(
  value: string,
  from: string,
  to: string,
  units: Record<string, UnitDefinition> | Record<string, TemperatureUnitDefinition>,
  isTemperature = false
): { value: string; error: string } {
  const validation = validateInput(value);
  if (!validation.isValid) return { value: "", error: validation.error || "유효한 숫자를 입력해주세요" };
  if (value.trim() === "") return { value: "", error: "" };
  try {
    const result = isTemperature
      ? convertTemperature(Number(value), from, to)
      : convertUnit(Number(value), from, to, units as Record<string, UnitDefinition>);
    return { value: formatNumber(result), error: "" };
  } catch (error) {
    return { value: "", error: error instanceof Error ? error.message : "변환 중 오류가 발생했습니다" };
  }
}

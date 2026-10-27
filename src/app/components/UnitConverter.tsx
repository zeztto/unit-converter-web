import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeftRight, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import {
  lengthUnits,
  weightUnits,
  volumeUnits,
  temperatureUnits,
  convertInput,
  type UnitDefinition,
  type TemperatureUnitDefinition,
} from "../utils/unitConversions";

interface ConverterProps {
  title: string;
  description: string;
  units: Record<string, UnitDefinition> | Record<string, TemperatureUnitDefinition>;
  isTemperature?: boolean;
}

function Converter({ title, description, units, isTemperature = false }: ConverterProps) {
  const unitNames = useMemo(() => Object.keys(units), [units]);
  const [fromUnit, setFromUnit] = useState(unitNames[0]);
  const [toUnit, setToUnit] = useState(unitNames[1] || unitNames[0]);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [error, setError] = useState<string>("");

  const getUnitDisplay = useCallback(
    (unitName: string) => {
      const unitData = units[unitName];
      return `${unitName} (${unitData.symbol})`;
    },
    [units]
  );

  const handleFromValueChange = useCallback((value: string) => {
    setFromValue(value);
    const result = convertInput(value, fromUnit, toUnit, units, isTemperature);
    setToValue(result.value);
    setError(result.error);
  }, [fromUnit, toUnit, units, isTemperature]);

  const handleToValueChange = useCallback((value: string) => {
    setToValue(value);
    const result = convertInput(value, toUnit, fromUnit, units, isTemperature);
    setFromValue(result.value);
    setError(result.error);
  }, [fromUnit, toUnit, units, isTemperature]);

  const handleFromUnitChange = useCallback((unit: string) => {
    setFromUnit(unit);
    const result = convertInput(fromValue, unit, toUnit, units, isTemperature);
    setToValue(result.value);
    setError(result.error);
  }, [fromValue, toUnit, units, isTemperature]);

  const handleToUnitChange = useCallback((unit: string) => {
    setToUnit(unit);
    const result = convertInput(fromValue, fromUnit, unit, units, isTemperature);
    setToValue(result.value);
    setError(result.error);
  }, [fromValue, fromUnit, units, isTemperature]);

  const handleSwapUnits = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  }, [fromUnit, toUnit, fromValue, toValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div
            className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            id="error-message"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="from-input">변환할 값</Label>
          <Input
            id="from-input"
            type="number"
            placeholder="값을 입력하세요"
            value={fromValue}
            onChange={(e) => handleFromValueChange(e.target.value)}
            aria-label="변환할 값 입력"
            aria-describedby={error ? "error-message" : undefined}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="원본 단위 선택">
            {unitNames.map((unit) => (
              <Button
                key={unit}
                variant={fromUnit === unit ? "default" : "outline"}
                onClick={() => handleFromUnitChange(unit)}
                className="w-full text-xs sm:text-sm"
                aria-pressed={fromUnit === unit}
              >
                {getUnitDisplay(unit)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapUnits}
            className="rounded-full"
            aria-label="단위 교환"
            title="단위 교환"
          >
            <ArrowLeftRight className="size-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="space-y-3">
          <Label htmlFor="to-input">변환된 값</Label>
          <Input
            id="to-input"
            type="number"
            placeholder="결과"
            value={toValue}
            onChange={(e) => handleToValueChange(e.target.value)}
            aria-label="변환된 값 입력"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="변환 단위 선택">
            {unitNames.map((unit) => (
              <Button
                key={unit}
                variant={toUnit === unit ? "default" : "outline"}
                onClick={() => handleToUnitChange(unit)}
                className="w-full text-xs sm:text-sm"
                aria-pressed={toUnit === unit}
              >
                {getUnitDisplay(unit)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UnitConverter() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-center gap-3">
        <Calculator className="size-8" aria-hidden="true" />
        <h1 className="text-center">단위 변환기</h1>
      </header>
      <p className="text-muted-foreground text-center">
        다양한 단위를 간편하게 변환하세요
      </p>

      <Tabs defaultValue="length" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4" role="tablist">
          <TabsTrigger value="length">길이</TabsTrigger>
          <TabsTrigger value="weight">무게</TabsTrigger>
          <TabsTrigger value="temperature">온도</TabsTrigger>
          <TabsTrigger value="volume">부피</TabsTrigger>
        </TabsList>

        <TabsContent value="length" className="mt-6">
          <Converter
            title="길이 변환"
            description="미터, 킬로미터, 마일 등 다양한 길이 단위를 변환합니다"
            units={lengthUnits}
          />
        </TabsContent>

        <TabsContent value="weight" className="mt-6">
          <Converter
            title="무게 변환"
            description="킬로그램, 그램, 파운드 등 다양한 무게 단위를 변환합니다"
            units={weightUnits}
          />
        </TabsContent>

        <TabsContent value="temperature" className="mt-6">
          <Converter
            title="온도 변환"
            description="섭씨, 화씨, 켈빈 온도 단위를 변환합니다"
            units={temperatureUnits}
            isTemperature={true}
          />
        </TabsContent>

        <TabsContent value="volume" className="mt-6">
          <Converter
            title="부피 변환"
            description="리터, 갤런, 밀리리터 등 다양한 부피 단위를 변환합니다"
            units={volumeUnits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import test from 'node:test';
import assert from 'node:assert/strict';
import {lengthUnits,weightUnits,volumeUnits,temperatureUnits,convertUnit,convertTemperature,validateInput,formatNumber,convertInput} from '../src/app/utils/unitConversions.ts';
test('metric conversions and negative/zero boundary',()=>{
 assert.equal(convertUnit(1,'미터','센티미터',lengthUnits),100);
 assert.equal(convertUnit(1,'킬로그램','그램',weightUnits),1000);
 assert.equal(convertUnit(1,'리터','밀리리터',volumeUnits),1000);
 assert.equal(convertUnit(-1,'미터','밀리미터',lengthUnits),-1000);
 assert.equal(convertUnit(0,'미터','인치',lengthUnits),0);
});
test('all supported unit pairs round trip',()=>{
 for(const units of [lengthUnits,weightUnits,volumeUnits]) for(const from of Object.keys(units)) for(const to of Object.keys(units)) for(const value of [-1.25,0,1e-12,12345.6789]){
  const actual=convertUnit(convertUnit(value,from,to,units),to,from,units);
  assert.ok(Math.abs(actual-value)<=Math.max(1e-24,Math.abs(value)*1e-12));
 }
 for(const from of Object.keys(temperatureUnits)) for(const to of Object.keys(temperatureUnits)) assert.ok(Math.abs(convertTemperature(convertTemperature(-40,from,to),to,from)+40)<1e-10);
 assert.equal(convertTemperature(0,'섭씨','화씨'),32);
 assert.equal(convertTemperature(100,'섭씨','켈빈'),373.15);
});
test('validation rejects partial and nonfinite numeric input',()=>{
 for(const value of ['abc','12abc','1.2.3','Infinity','1e309']) assert.equal(validateInput(value).isValid,false,value);
 for(const value of ['', ' -12.5 ','1e-12']) assert.equal(validateInput(value).isValid,true,value);
 assert.throws(()=>convertUnit(1,'unknown','미터',lengthUnits));
});
test('tiny results retain nonzero value',()=>{
 assert.throws(()=>formatNumber(Infinity)); assert.notEqual(formatNumber(1e-12),'0'); assert.equal(formatNumber(0),'0'); assert.equal(formatNumber(1.5),'1.5');
});

test('unit selection overflow clears result and next valid selection clears error',()=>{
 const valid=convertInput('1e307','미터','킬로미터',lengthUnits);
 assert.equal(valid.error,'');assert.ok(valid.value);
 const overflow=convertInput('1e307','미터','밀리미터',lengthUnits);
 assert.equal(overflow.value,'');assert.ok(overflow.error);
 const recovered=convertInput('1e307','미터','킬로미터',lengthUnits);
 assert.equal(recovered.error,'');assert.equal(recovered.value,valid.value);
});
